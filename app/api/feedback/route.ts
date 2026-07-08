import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "../../../lib/nextauth"
import { z } from "zod"

const payloadSchema = z.object({
  content: z.string().min(10),
  channel: z.enum(["EMAIL", "WEB", "APPSTORE", "NPS", "SOCIAL", "CALL"]),
})

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
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
      workspaceId: session.user.workspaceId,
      status: "NEW",
    },
  })

  return NextResponse.json(result)
}
