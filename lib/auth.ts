import bcrypt from "bcryptjs"
import { prisma } from "./prisma"
import { Role } from "@prisma/client"

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function createWorkspaceWithAdmin(name: string, email: string, password: string) {
  const passwordHash = await hashPassword(password)
  return prisma.workspace.create({
    data: {
      name,
      users: {
        create: {
          email,
          passwordHash,
          role: Role.ADMIN,
        },
      },
    },
    include: { users: true },
  })
}
