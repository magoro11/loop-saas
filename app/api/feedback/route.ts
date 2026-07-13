import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../lib/nextauth"
import type { Session } from "next-auth"
import { z } from "zod"
import { Channel, Status } from "@prisma/client"

const payloadSchema = z.object({
  content: z.string().min(10),
  channel: z.enum(["EMAIL", "WEB", "APPSTORE", "NPS", "SOCIAL", "CALL"]),
})

export async function GET(request: Request) {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")
  const channel = searchParams.get("channel")
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 100)
  const offset = Number(searchParams.get("offset")) || 0

  const where: any = { workspaceId: session.user.workspaceId }
  if (status) where.status = status
  if (channel) where.channel = channel

  const [feedbacks, total] = await Promise.all([
    prisma.feedback.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
      include: {
        themes: {
          include: {
            theme: true,
          },
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
      channel: parsed.data.channel as Channel,
      workspaceId: session.user.workspaceId,
      status: Status.NEW,
    },
  })

  return NextResponse.json(result)
}
