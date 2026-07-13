import { NextResponse } from "next/server"
import { prisma } from "../../../../../lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../lib/nextauth"
import type { Session } from "next-auth"
import { z } from "zod"

const assignSchema = z.object({
  feedbackId: z.string().min(1),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ themeId: string }> }
) {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { themeId } = await params
  const body = await request.json()
  const parsed = assignSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  }

  const theme = await prisma.theme.findFirst({
    where: { id: themeId, workspaceId: session.user.workspaceId },
  })

  if (!theme) {
    return NextResponse.json({ error: "Theme not found" }, { status: 404 })
  }

  const feedback = await prisma.feedback.findFirst({
    where: { id: parsed.data.feedbackId, workspaceId: session.user.workspaceId },
  })

  if (!feedback) {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
  }

  const assignment = await prisma.feedbackTheme.create({
    data: {
      feedbackId: parsed.data.feedbackId,
      themeId,
      confidence: 1.0,
    },
    include: {
      feedback: true,
      theme: true,
    },
  })

  return NextResponse.json(assignment, { status: 201 })
}
