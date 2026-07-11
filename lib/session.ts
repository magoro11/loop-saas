import { cookies } from "next/headers"
import { prisma } from "./prisma"

export async function getSessionUser() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session_token")?.value
  if (!token) return null

  const session = await prisma.session.findUnique({
    where: { sessionToken: token },
    include: { user: true },
  })
  if (!session || session.expires < new Date()) return null

  return session.user
}
