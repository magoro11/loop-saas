import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../lib/nextauth"
import type { Session } from "next-auth"
import { z } from "zod"
import { Role, Status, Channel } from "@prisma/client"

import { classifyFeedback, generateEmbedding } from "../../../lib/ai"

const payloadSchema = z.object({
  content: z.string().min(1, "Content is required"),
  channel: z.enum(["EMAIL", "WEB", "APPSTORE", "NPS", "SOCIAL", "CALL"]),
  sourceRef: z.string().optional(),
  customerLabel: z.string().optional(),
})

function requireRole(session: Session | null, allowedRoles: string[]) {
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!allowedRoles.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return null
}

export async function GET(request: Request) {
  const session = (await getServerSession(authOptions)) as Session | null
  const forbidden = requireRole(session, [Role.ADMIN, Role.ANALYST, Role.VIEWER])
  if (forbidden) return forbidden

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const channel = searchParams.get("channel")
  const sentiment = searchParams.get("sentiment")
  const themeId = searchParams.get("themeId")
  const q = searchParams.get("q")
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")
  const limit = Math.min(Number(searchParams.get("limit")) || 25, 100)
  const offset = Number(searchParams.get("offset")) || 0

  const where: any = { workspaceId: session!.user.workspaceId }
  if (status) where.status = status
  if (channel) where.channel = channel
  if (sentiment) where.sentiment = sentiment
  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) where.createdAt.gte = new Date(startDate)
    if (endDate) where.createdAt.lte = new Date(endDate)
  }
  if (themeId) {
    where.themes = { some: { themeId } }
  }
  if (q) {
    where.content = { contains: q, mode: "insensitive" }
  }

  const [feedbacks, total] = await Promise.all([
    prisma.feedback.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        themes: {
          include: { theme: true },
        },
        embedding: {
          select: { vector: true },
        },
      },
    }),
    prisma.feedback.count({ where }),
  ])

  return NextResponse.json({
    feedbacks,
    total,
    limit,
    offset,
  })
}

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions)) as Session | null
  const forbidden = requireRole(session, [Role.ADMIN, Role.ANALYST])
  if (forbidden) return forbidden

  const contentType = request.headers.get("content-type") || ""

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const text = await file.text()
    const lines = text.split(/\r?\n/).filter((l) => l.trim())
    if (lines.length < 2) {
      return NextResponse.json({ error: "CSV appears empty" }, { status: 400 })
    }

    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
    const contentIdx = headers.findIndex((h) => h === "content")
    const channelIdx = headers.findIndex((h) => h === "channel")
    const sourceRefIdx = headers.findIndex((h) => h === "sourceref" || h === "source_ref")
    const customerLabelIdx = headers.findIndex((h) => h === "customerlabel" || h === "customer_label")

    if (contentIdx === -1 || channelIdx === -1) {
      return NextResponse.json({ error: "CSV must have 'content' and 'channel' columns" }, { status: 400 })
    }

    let imported = 0
    let failed = 0
    const errors: string[] = []

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i])
      const content = cols[contentIdx]?.trim()
      const channel = cols[channelIdx]?.trim()?.toUpperCase()
      if (!content || ![Channel.EMAIL, Channel.WEB, Channel.APPSTORE, Channel.NPS, Channel.SOCIAL, Channel.CALL].includes(channel as Channel)) {
        failed++
        errors.push(`Row ${i + 1}: invalid content or channel`)
        continue
      }
      try {
        await prisma.feedback.create({
          data: {
            content,
            channel: channel as any,
            sourceRef: sourceRefIdx >= 0 ? cols[sourceRefIdx]?.trim() : undefined,
            customerLabel: customerLabelIdx >= 0 ? cols[customerLabelIdx]?.trim() : undefined,
            workspaceId: session!.user.workspaceId,
            status: Status.NEW,
          },
        })
        imported++
      } catch (e) {
        failed++
        errors.push(`Row ${i + 1}: database error`)
      }
    }

    return NextResponse.json({ imported, failed, errors })
  }

  const body = await request.json()
  const parsed = payloadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  }

  const result = await prisma.feedback.create({
    data: {
      content: parsed.data.content,
      channel: parsed.data.channel,
      sourceRef: parsed.data.sourceRef,
      customerLabel: parsed.data.customerLabel,
      workspaceId: session!.user.workspaceId,
      status: Status.NEW,
    },
  })

  classifyFeedbackInBackground(result.id, session!.user.workspaceId, parsed.data.content).catch(() => {})

  return NextResponse.json(result)
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ""
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === "," && !inQuotes) {
      result.push(current)
      current = ""
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

async function classifyFeedbackInBackground(feedbackId: string, workspaceId: string, content: string) {
  try {
    const existingThemes = await prisma.theme.findMany({
      where: { workspaceId },
      select: { name: true },
    })
    const classification = await classifyFeedback(content, existingThemes.map((t) => t.name))
    const vector = await generateEmbedding(content)

    await prisma.$transaction(async (tx) => {
      await tx.feedback.update({
        where: { id: feedbackId },
        data: {
          sentiment: classification.sentiment,
          sentimentScore: classification.sentimentScore,
        },
      })

      await tx.embedding.upsert({
        where: { feedbackId },
        update: { vector },
        create: {
          feedbackId,
          vector,
          workspaceId,
        },
      })

      for (const themeName of classification.themes) {
        let theme = await tx.theme.findFirst({
          where: { name: themeName, workspaceId },
        })

        if (!theme) {
          theme = await tx.theme.create({
            data: {
              name: themeName,
              description: `Auto-created from classification: ${classification.featureArea}`,
              workspaceId,
            },
          })
        }

        await tx.feedbackTheme.upsert({
          where: { feedbackId_themeId: { feedbackId, themeId: theme.id } },
          update: { confidence: 0.85 },
          create: {
            feedbackId,
            themeId: theme.id,
            confidence: 0.85,
          },
        })
      }
    })
  } catch (error) {
    console.error("Background classification failed:", error)
  }
}
