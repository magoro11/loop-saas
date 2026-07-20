import { redirect } from "next/navigation"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "../../lib/nextauth"
import { prisma } from "../../lib/prisma"

export default async function DashboardPage() {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user) {
    redirect("/login")
  }

  let feedbackCount = 0
  let themeCount = 0
  let reportCount = 0
  let recentFeedbacks: any[] = []
  let channelStats: any[] = []
  let statusStats: any[] = []
  let topThemes: any[] = []

  try {
    [feedbackCount, themeCount, reportCount, recentFeedbacks, channelStats, statusStats, topThemes] =
      await Promise.all([
        prisma.feedback.count({ where: { workspaceId: session.user.workspaceId } }),
        prisma.theme.count({ where: { workspaceId: session.user.workspaceId } }),
        prisma.report.count({ where: { workspaceId: session.user.workspaceId } }),
        prisma.feedback.findMany({
          where: { workspaceId: session.user.workspaceId },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, content: true, channel: true, status: true, createdAt: true },
        }),
        prisma.feedback.groupBy({
          by: ["channel"],
          where: { workspaceId: session.user.workspaceId },
          _count: { channel: true },
        }),
        prisma.feedback.groupBy({
          by: ["status"],
          where: { workspaceId: session.user.workspaceId },
          _count: { status: true },
        }),
        prisma.theme.findMany({
          where: { workspaceId: session.user.workspaceId },
          include: {
            _count: {
              select: { feedbacks: true },
            },
          },
          orderBy: { feedbacks: { _count: "desc" } },
          take: 5,
        }),
      ])
  } catch (error) {
    console.error("Failed to load dashboard stats:", error)
  }

  const maxChannelCount = Math.max(...channelStats.map((c) => c._count.channel), 1)

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_80px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Customer intelligence workspace</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-slate-900">Welcome back to LOOP</h1>
            <p className="mt-4 max-w-2xl text-slate-600">
              Turn raw customer feedback into a prioritized view of themes, risks, and follow-up actions for your team.
            </p>
          </div>
          <Link href="/dashboard/feedback/new" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
            Add feedback
          </Link>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Workspace summary</p>
            <h2 className="mt-4 text-2xl font-semibold text-slate-900">What needs attention</h2>
            <p className="mt-3 text-sm text-slate-500">Use the sidebar to switch between the inbox, themes, and reports.</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/dashboard/feedback" className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300">
              <h3 className="text-lg font-semibold">Feedback inbox</h3>
              <p className="mt-2 text-sm text-slate-600">{feedbackCount} item{feedbackCount === 1 ? "" : "s"} waiting in your workspace.</p>
            </Link>
            <Link href="/dashboard/themes" className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300">
              <h3 className="text-lg font-semibold">Themes</h3>
              <p className="mt-2 text-sm text-slate-600">{themeCount} saved theme{themeCount === 1 ? "" : "s"} for your workspace.</p>
            </Link>
            <Link href="/dashboard/reports" className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300">
              <h3 className="text-lg font-semibold">Reports</h3>
              <p className="mt-2 text-sm text-slate-600">{reportCount} generated report{reportCount === 1 ? "" : "s"} available.</p>
            </Link>
            <Link href="/dashboard/feedback/new" className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300">
              <h3 className="text-lg font-semibold">Add feedback</h3>
              <p className="mt-2 text-sm text-slate-600">Capture new customer feedback quickly.</p>
            </Link>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_20px_80px_rgba(15,23,42,0.12)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-400">Analyst view</p>
            <h2 className="mt-3 text-xl font-semibold">Prioritize by impact, not just volume</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              The strongest themes are the ones that combine frequency, severity, and business importance. LOOP helps you surface those patterns faster.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Feedback</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{feedbackCount}</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Themes</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{themeCount}</p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 text-center shadow-sm">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Reports</p>
              <p className="mt-4 text-3xl font-semibold text-slate-900">{reportCount}</p>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Signal snapshot</h2>
                <p className="mt-2 text-sm text-slate-500">See which channels are generating the most feedback and what themes are emerging.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Feedback by channel</p>
                <div className="mt-4 flex items-end gap-3">
                  {channelStats.length === 0 ? (
                    <p className="text-sm text-slate-400">No data yet.</p>
                  ) : (
                    channelStats.map((item) => (
                      <div key={item.channel} className="flex flex-1 flex-col items-center justify-end gap-2">
                        <div
                          className="w-full rounded-t-[0.9rem] bg-gradient-to-t from-slate-900 via-slate-700 to-slate-400"
                          style={{ height: `${(item._count.channel / maxChannelCount) * 100}%`, minHeight: "8px" }}
                        />
                        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">{item.channel}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Top themes</p>
                {topThemes.length === 0 ? (
                  <p className="text-sm text-slate-400">No themes yet. Create your first theme to see it here.</p>
                ) : (
                  topThemes.map((theme) => (
                    <Link
                      key={theme.id}
                      href={`/dashboard/themes`}
                      className="flex items-center justify-between gap-3 rounded-[1.25rem] border border-slate-200 bg-white p-4 transition hover:border-slate-300"
                    >
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">{theme.name}</h3>
                        <p className="mt-0.5 text-xs text-slate-500">{theme._count.feedbacks} feedback item{theme._count.feedbacks === 1 ? "" : "s"}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                        {theme._count.feedbacks}
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Recent feedback</h2>
                <p className="mt-2 text-sm text-slate-500">The latest signals from your workspace.</p>
              </div>
              <Link href="/dashboard/feedback" className="text-sm font-semibold text-slate-900 transition hover:text-slate-700">
                View all
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {recentFeedbacks.length === 0 ? (
                <p className="text-sm text-slate-400">No feedback yet.</p>
              ) : (
                recentFeedbacks.map((item) => (
                  <Link
                    key={item.id}
                    href={`/dashboard/feedback`}
                    className="flex items-start justify-between gap-4 rounded-[1.25rem] border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300"
                  >
                    <div>
                      <span className="inline-flex rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-700">
                        {item.channel}
                      </span>
                      <p className="mt-2 text-sm text-slate-700 line-clamp-2">{item.content}</p>
                    </div>
                    <span className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
