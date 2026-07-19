import { NextResponse } from "next/server"
import { prisma } from "../../../lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../lib/nextauth"
import type { Session } from "next-auth"
import { z } from "zod"
import { Role } from "@prisma/client"

function requireRole(session: Session | null, allowedRoles: string[]) {
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!allowedRoles.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return null
}

const themeSchema = z.object({
  name: z.string().min(2, "Theme name must be at least 2 characters"),
  description: z.string().optional(),
  color: z.string().optional(),
})

export async function GET() {
  const session = (await getServerSession(authOptions)) as Session | null
  const forbidden = requireRole(session, [Role.ADMIN, Role.ANALYST, Role.VIEWER])
  if (forbidden) return forbidden

  const themes = await prisma.theme.findMany({
    where: { workspaceId: session!.user.workspaceId },
    include: {
      feedbacks: {
        include: {
          feedback: true,
        },
      },
      _count: {
        select: { feedbacks: true },
      },
    },
    orderBy: { name: "asc" },
  })

  return NextResponse.json({ themes })
}

export async function POST(request: Request) {
  const session = (await getServerSession(authOptions)) as Session | null
  const forbidden = requireRole(session, [Role.ADMIN, Role.ANALYST])
  if (forbidden) return forbidden

  const body = await request.json()
  const parsed = themeSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  }

  const theme = await prisma.theme.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      color: parsed.data.color,
      workspaceId: session!.user.workspaceId,
    },
  })

  return NextResponse.json(theme, { status: 201 })
}
