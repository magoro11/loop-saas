import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma?: PrismaClient }

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log: ["query", "error"],
  })
}

async function connectWithRetry(client: PrismaClient, maxRetries = 3, delayMs = 1000): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await client.$connect()
      return
    } catch (error) {
      if (attempt === maxRetries) {
        console.error(`Prisma connection failed after ${maxRetries} attempts:`, error)
        throw error
      }
      console.warn(`Prisma connection attempt ${attempt} failed, retrying in ${delayMs}ms...`)
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

connectWithRetry(prisma).catch((error) => {
  console.error("Initial Prisma connection failed:", error)
})
