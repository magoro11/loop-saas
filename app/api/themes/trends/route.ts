import { NextResponse } from "next/server"
import { prisma } from "../../../../lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../lib/nextauth"
import type { Session } from "next-auth"
import { Role } from "@prisma/client"

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
  const periodDays = Number(searchParams.get("periodDays")) || 30
  const previousPeriodDays = Number(searchParams.get("previousPeriodDays")) || 30

  const now = new Date()
  const currentStart = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000)
  const previousStart = new Date(currentStart.getTime() - previousPeriodDays * 24 * 60 * 60 * 1000)
  const previousEnd = currentStart

  const [currentThemes, previousThemes] = await Promise.all([
    prisma.feedbackTheme.groupBy({
      by: ["themeId"],
      where: {
        feedback: {
          workspaceId: session!.user.workspaceId,
          createdAt: { gte: currentStart },
        },
      },
      _count: { themeId: true },
      orderBy: { _count: { themeId: "desc" } },
      take: 10,
    }),
    prisma.feedbackTheme.groupBy({
      by: ["themeId"],
      where: {
        feedback: {
          workspaceId: session!.user.workspaceId,
          createdAt: { gte: previousStart, lt: previousEnd },
        },
      },
      _count: { themeId: true },
    }),
  ])

  const previousMap = new Map(previousThemes.map((t) => [t.themeId, t._count.themeId]))
  const currentMap = new Map(currentThemes.map((t) => [t.themeId, t._count.themeId]))

  const themeIds = Array.from(new Set([...currentMap.keys(), ...previousMap.keys()]))
  const themes = await prisma.theme.findMany({
    where: { id: { in: themeIds }, workspaceId: session!.user.workspaceId },
  })
  const themeMap = new Map(themes.map((t) => [t.id, t]))

  const trends = themeIds.map((id) => {
    const current = currentMap.get(id) || 0
    const previous = previousMap.get(id) || 0
    const change = previous === 0 ? (current > 0 ? Infinity : 0) : ((current - previous) / previous) * 100
    return {
      themeId: id,
      name: themeMap.get(id)?.name || "Unknown",
      current,
      previous,
      change,
      isSpiking: change > 50 && current >= 3,
    }
  })

  return NextResponse.json({ trends })
}
