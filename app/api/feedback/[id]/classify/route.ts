import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../../lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../lib/nextauth"
import type { Session } from "next-auth"
import { classifyFeedback, generateEmbedding } from "../../../../../lib/ai"
import { Role } from "@prisma/client"

function requireRole(session: Session | null, allowedRoles: string[]) {
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!allowedRoles.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return null
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = (await getServerSession(authOptions)) as Session | null
  const forbidden = requireRole(session, [Role.ADMIN, Role.ANALYST])
  if (forbidden) return forbidden

  const { id } = await context.params
  const feedback = await prisma.feedback.findFirst({
    where: { id, workspaceId: session!.user.workspaceId },
  })

  if (!feedback) {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
  }

  const existingThemes = await prisma.theme.findMany({
    where: { workspaceId: session!.user.workspaceId },
    select: { name: true },
  })

  const themeNames = existingThemes.map((t) => t.name)
  const classification = await classifyFeedback(feedback.content, themeNames)

  const vector = await generateEmbedding(feedback.content)

  await prisma.$transaction(async (tx) => {
    await tx.feedback.update({
      where: { id, workspaceId: session!.user.workspaceId },
      data: {
        sentiment: classification.sentiment,
        sentimentScore: classification.sentimentScore,
      },
    })

    await tx.embedding.upsert({
      where: { feedbackId: id },
      update: { vector },
      create: {
        feedbackId: id,
        vector,
        workspaceId: session!.user.workspaceId,
      },
    })

    for (const themeName of classification.themes) {
      let theme = await tx.theme.findFirst({
        where: { name: themeName, workspaceId: session!.user.workspaceId },
      })

      if (!theme) {
        theme = await tx.theme.create({
          data: {
            name: themeName,
            description: `Auto-created from classification: ${classification.featureArea}`,
            workspaceId: session!.user.workspaceId,
          },
        })
      }

      await tx.feedbackTheme.upsert({
        where: { feedbackId_themeId: { feedbackId: id, themeId: theme.id } },
        update: { confidence: 0.85 },
        create: {
          feedbackId: id,
          themeId: theme.id,
          confidence: 0.85,
        },
      })
    }
  })

  return NextResponse.json({ classification, feedbackId: id })
}
