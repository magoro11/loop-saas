import { getServerSession } from "next-auth/next"
import { authOptions } from "./nextauth"

export async function getServerAuthSession() {
  return getServerSession(authOptions)
}
