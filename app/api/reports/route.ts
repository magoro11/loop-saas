import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../lib/nextauth"
import type { Session } from "next-auth"
import { z } from "zod"
import { generateReportNarrative } from "../../../lib/ai"
import { Role, Sentiment } from "@prisma/client"

function requireRole(session: Session | null, allowedRoles: string[]) {
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!allowedRoles.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return null
}

const reportSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  contentJson: z.string().optional(),
  generateAI: z.boolean().optional().default(false),
})

export async function GET() {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const reports = await prisma.report.findMany({
    where: { workspaceId: session.user.workspaceId },
    include: {
      generatedBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ reports })
}

export async function POST(request: NextRequest) {
  const session = (await getServerSession(authOptions)) as Session | null
  const forbidden = requireRole(session, [Role.ADMIN, Role.ANALYST])
  if (forbidden) return forbidden

  const body = await request.json()
  const parsed = reportSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  }

  let contentJson = parsed.data.contentJson || "{}"
  if (parsed.data.generateAI) {
    const start = new Date(parsed.data.periodStart)
    const end = new Date(parsed.data.periodEnd)

    const [periodFeedbacks, allThemes] = await Promise.all([
      prisma.feedback.findMany({
        where: {
          workspaceId: session!.user.workspaceId,
          createdAt: { gte: start, lte: end },
        },
        select: { id: true, content: true, channel: true, sentiment: true, status: true },
      }),
      prisma.theme.findMany({
        where: { workspaceId: session!.user.workspaceId },
        include: {
          _count: {
            select: { feedbacks: true },
          },
        },
        orderBy: { feedbacks: { _count: "desc" } },
        take: 10,
      }),
    ])

    const themeCounts = allThemes.map((t) => ({ name: t.name, count: t._count.feedbacks }))

    const sentimentBreakdown = periodFeedbacks.reduce(
      (acc, f) => {
        if (f.sentiment === Sentiment.POSITIVE) acc.positive++
        else if (f.sentiment === Sentiment.NEGATIVE) acc.negative++
        else if (f.sentiment === Sentiment.NEUTRAL) acc.neutral++
        return acc
      },
      { positive: 0, neutral: 0, negative: 0 }
    )

    const channelBreakdown = periodFeedbacks.reduce((acc: Record<string, number>, f) => {
      acc[f.channel] = (acc[f.channel] || 0) + 1
      return acc
    }, {})

    const recentFeedback = periodFeedbacks.slice(0, 5).map((f) => ({
      content: f.content.slice(0, 150),
      channel: f.channel,
    }))

    const narrative = await generateReportNarrative({
      totalFeedback: periodFeedbacks.length,
      topThemes: themeCounts.slice(0, 5),
      sentimentBreakdown,
      channelBreakdown,
      recentFeedback,
    })

    const stats = {
      totalFeedback: periodFeedbacks.length,
      topThemes: themeCounts.slice(0, 5),
      sentimentBreakdown,
      channelBreakdown,
      recentFeedback: periodFeedbacks.slice(0, 5).map((f) => ({
        id: f.id,
        content: f.content.slice(0, 150),
        channel: f.channel,
      })),
    }

    contentJson = JSON.stringify({ ...stats, narrative })
  }

  const report = await prisma.report.create({
    data: {
      title: parsed.data.title,
      periodStart: new Date(parsed.data.periodStart),
      periodEnd: new Date(parsed.data.periodEnd),
      contentJson,
      workspaceId: session!.user.workspaceId,
      generatedById: session!.user.id,
    },
    include: {
      generatedBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  return NextResponse.json(report, { status: 201 })
}
