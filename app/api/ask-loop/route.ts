import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../lib/nextauth"
import type { Session } from "next-auth"
import { askLoop, cosineSimilarity, generateEmbedding } from "../../../lib/ai"
import { Role } from "@prisma/client"

function requireRole(session: Session | null, allowedRoles: string[]) {
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!allowedRoles.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return null
}

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions)) as Session | null
  const forbidden = requireRole(session, [Role.ADMIN, Role.ANALYST, Role.VIEWER])
  if (forbidden) return forbidden

  const body = await request.json()
  const question = typeof body?.question === "string" ? body.question.trim() : ""
  if (!question) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 })
  }

  const embeddings = await prisma.embedding.findMany({
    where: { workspaceId: session!.user.workspaceId },
    include: {
      feedback: {
        select: { id: true, content: true },
      },
    },
  })

  if (embeddings.length === 0) {
    return NextResponse.json({
      answer: "No feedback data available yet. Add some feedback first.",
      citations: [],
    })
  }

  const feedbacksWithVectors = embeddings
    .filter((e) => e.vector && e.feedback)
    .map((e) => ({
      id: e.feedback!.id,
      content: e.feedback!.content,
      vector: e.vector as number[],
    }))

  const result = await askLoop(question, feedbacksWithVectors)

  return NextResponse.json(result)
}
