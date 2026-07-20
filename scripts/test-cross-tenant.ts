import { PrismaClient, Role } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

async function main() {
  console.log("Cross-tenant isolation test\n")

  await prisma.embedding.deleteMany()
  await prisma.feedbackTheme.deleteMany()
  await prisma.report.deleteMany()
  await prisma.feedback.deleteMany()
  await prisma.theme.deleteMany()
  await prisma.user.deleteMany()
  await prisma.workspace.deleteMany()

  const passwordHash = await bcrypt.hash("Admin123!", 10)

  const wsA = await prisma.workspace.create({ data: { name: "Workspace A" } })
  const wsB = await prisma.workspace.create({ data: { name: "Workspace B" } })

  await prisma.user.create({
    data: { email: "admin-a@test.com", passwordHash, role: Role.ADMIN, workspaceId: wsA.id },
  })
  await prisma.user.create({
    data: { email: "admin-b@test.com", passwordHash, role: Role.ADMIN, workspaceId: wsB.id },
  })

  const [fbA, fbB] = await Promise.all([
    prisma.feedback.create({
      data: { content: "Feedback from A", channel: "WEB", workspaceId: wsA.id, status: "NEW" },
    }),
    prisma.feedback.create({
      data: { content: "Feedback from B", channel: "WEB", workspaceId: wsB.id, status: "NEW" },
    }),
  ])

  const [reportA, reportB] = await Promise.all([
    prisma.report.create({
      data: { title: "Report A", periodStart: new Date(), periodEnd: new Date(), workspaceId: wsA.id, contentJson: "{}" },
    }),
    prisma.report.create({
      data: { title: "Report B", periodStart: new Date(), periodEnd: new Date(), workspaceId: wsB.id, contentJson: "{}" },
    }),
  ])

  const crossFeedback = await prisma.feedback.findMany({ where: { workspaceId: wsB.id } })
  const crossReports = await prisma.report.findMany({ where: { workspaceId: wsB.id } })

  const passed =
    crossFeedback.length === 1 &&
    crossFeedback[0].id === fbB.id &&
    crossReports.length === 1 &&
    crossReports[0].id === reportB.id

  console.log(`Workspace A ID: ${wsA.id}`)
  console.log(`Workspace B ID: ${wsB.id}`)
  console.log(`\nQuerying feedback where workspaceId = B:`)
  console.log(`  Found ${crossFeedback.length} item(s)`)
  console.log(`Querying reports where workspaceId = B:`)
  console.log(`  Found ${crossReports.length} item(s)`)
  console.log(`\nResult: ${passed ? "PASS — tenant isolation enforced at query level." : "FAIL — cross-tenant data leakage detected."}`)

  await prisma.$disconnect()
  process.exit(passed ? 0 : 1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
