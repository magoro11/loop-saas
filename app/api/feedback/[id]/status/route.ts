import { NextRequest, NextResponse } from "next/server"
import { prisma } from "../../../../../lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../../lib/nextauth"
import type { Session } from "next-auth"
import { z } from "zod"
import { Role, Status } from "@prisma/client"

const statusSchema = z.object({
  status: z.nativeEnum(Status),
})

function requireRole(session: Session | null, allowedRoles: string[]) {
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  if (!allowedRoles.includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return null
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = (await getServerSession(authOptions)) as Session | null
  const forbidden = requireRole(session, [Role.ADMIN, Role.ANALYST])
  if (forbidden) return forbidden

  const { id } = await context.params
  const body = await request.json()
  const parsed = statusSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  }

  const feedback = await prisma.feedback.findFirst({
    where: { id, workspaceId: session!.user.workspaceId },
  })

  if (!feedback) {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 })
  }

  const updated = await prisma.feedback.update({
    where: { id, workspaceId: session!.user.workspaceId },
    data: { status: parsed.data.status },
    include: {
      themes: { include: { theme: true } },
    },
  })

  return NextResponse.json(updated)
}
