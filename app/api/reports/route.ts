import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../lib/nextauth"
import type { Session } from "next-auth"
import { z } from "zod"

const reportSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  periodStart: z.string().datetime(),
  periodEnd: z.string().datetime(),
  contentJson: z.any().optional(),
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

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const parsed = reportSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  }

  const report = await prisma.report.create({
    data: {
      title: parsed.data.title,
      periodStart: new Date(parsed.data.periodStart),
      periodEnd: new Date(parsed.data.periodEnd),
      contentJson: parsed.data.contentJson || {},
      workspaceId: session.user.workspaceId,
      generatedById: session.user.id,
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
