import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash("Admin123!", 10)

  const workspace = await prisma.workspace.create({
    data: {
      name: "Demo Workspace",
      users: {
        create: [
          { email: "admin@demo.com", name: "Admin User", passwordHash, role: Role.ADMIN },
          { email: "analyst@demo.com", name: "Analyst User", passwordHash, role: Role.ANALYST },
          { email: "viewer@demo.com", name: "Viewer User", passwordHash, role: Role.VIEWER },
        ],
      },
    },
  })

  console.log("Created demo workspace", workspace.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
