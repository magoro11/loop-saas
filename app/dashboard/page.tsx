import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "../../lib/nextauth"
import Link from "next/link"
import { prisma } from "../../lib/prisma"

export default async function DashboardPage() {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user) {
    redirect("/login")
  }

  const [feedbackCount, themeCount, reportCount] = await Promise.all([
    prisma.feedback.count({ where: { workspaceId: session.user.workspaceId } }),
    prisma.theme.count({ where: { workspaceId: session.user.workspaceId } }),
    prisma.report.count({ where: { workspaceId: session.user.workspaceId } }),
  ])

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Welcome to LOOP</h1>
        <p className="mt-4 text-slate-600">Customer feedback intelligence for {session.user?.email}</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Workspace summary</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">Quick overview</h2>
            <p className="mt-3 text-sm text-slate-500">Use the sidebar to switch between feedback, themes, and report views.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/dashboard/feedback" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300">
              <h3 className="text-lg font-semibold">Feedback inbox</h3>
              <p className="mt-2 text-sm text-slate-600">{feedbackCount} item{feedbackCount === 1 ? "" : "s"} waiting in your workspace.</p>
            </Link>
            <Link href="/dashboard/themes" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300">
              <h3 className="text-lg font-semibold">Themes</h3>
              <p className="mt-2 text-sm text-slate-600">{themeCount} saved theme{themeCount === 1 ? "" : "s"} for your workspace.</p>
            </Link>
            <Link href="/dashboard/reports" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300">
              <h3 className="text-lg font-semibold">Reports</h3>
              <p className="mt-2 text-sm text-slate-600">{reportCount} generated report{reportCount === 1 ? "" : "s"} available.</p>
            </Link>
            <Link href="/dashboard/feedback/new" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300">
              <h3 className="text-lg font-semibold">Add feedback</h3>
              <p className="mt-2 text-sm text-slate-600">Capture new customer feedback quickly.</p>
            </Link>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Latest activity</h2>
            <p className="mt-3 text-sm text-slate-500">See the freshest feedback and take action from the feedback inbox.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Feedback</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{feedbackCount}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Themes</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{themeCount}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Reports</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{reportCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
