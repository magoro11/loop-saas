import { prisma } from "./prisma"

export function scoped(workspaceId: string) {
  return {
    feedback: {
      findMany: (args = {}) =>
        prisma.feedback.findMany({ where: { workspaceId }, ...args }),
      findFirst: (args = {}) =>
        prisma.feedback.findFirst({ where: { workspaceId }, ...args }),
      create: (args: any) => prisma.feedback.create({ data: { workspaceId, ...args.data } }),
    },
    theme: {
      findMany: (args = {}) =>
        prisma.theme.findMany({ where: { workspaceId }, ...args }),
      findFirst: (args = {}) =>
        prisma.theme.findFirst({ where: { workspaceId }, ...args }),
      create: (args: any) => prisma.theme.create({ data: { workspaceId, ...args.data } }),
    },
    report: {
      findMany: (args = {}) =>
        prisma.report.findMany({ where: { workspaceId }, ...args }),
      create: (args: any) => prisma.report.create({ data: { workspaceId, ...args.data } }),
    },
  }
}
