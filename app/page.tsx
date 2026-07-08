import type { Session } from "next-auth"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../lib/nextauth"
import { prisma } from "../lib/prisma"

export default async function Page() {
  const session = (await getServerSession(authOptions)) as Session | null

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-16 lg:gap-24">
          <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl sm:p-14">
            <div className="mx-auto max-w-4xl text-center">
              <p className="mb-4 inline-flex rounded-full bg-slate-100 px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-slate-700">
                Customer feedback intelligence
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                Turn customer feedback into product decisions.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                LOOP helps your team collect, categorize, and act on feedback from every channel — so you can prioritize product improvements with confidence.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Get started
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  View dashboard
                </Link>
              </div>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Collect feedback</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Capture input across web, email, in-app, and social channels so nothing slips through the cracks.
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Organize themes</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Group related feedback into themes and track what matters most to users.
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Generate insights</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Review summary metrics and report trends to stakeholders in a few clicks.
              </p>
            </div>
          </section>
        </div>
      </div>
    )
  }

  const [feedbackCount, themeCount, reportCount, recentFeedback] = await Promise.all([
    prisma.feedback.count({ where: { workspaceId: session.user.workspaceId } }),
    prisma.theme.count({ where: { workspaceId: session.user.workspaceId } }),
    prisma.report.count({ where: { workspaceId: session.user.workspaceId } }),
    prisma.feedback.findMany({
      where: { workspaceId: session.user.workspaceId },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, content: true, channel: true, createdAt: true, status: true },
    }),
  ])

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 lg:gap-24">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl sm:p-14">
          <div className="mx-auto max-w-4xl text-center">
            <p className="mb-4 inline-flex rounded-full bg-slate-100 px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-slate-700">
              Welcome back, {session.user.name ?? session.user.email}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Your workspace dashboard is ready.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Continue managing feedback, building themes, and generating reports for your team.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Open dashboard
              </Link>
              <Link
                href="/dashboard/feedback/new"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Add feedback
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
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
        </section>

        <section className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Recent feedback</h2>
                <p className="mt-2 text-sm text-slate-500">Quickly review the latest customer feedback from your workspace.</p>
              </div>
              <Link href="/dashboard/feedback" className="text-sm font-semibold text-slate-900 transition hover:text-slate-700">
                View all feedback →
              </Link>
            </div>

            <div className="mt-6 space-y-4">
              {recentFeedback.length === 0 ? (
                <p className="text-sm text-slate-500">No recent feedback to display yet.</p>
              ) : (
                recentFeedback.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{item.channel}</p>
                        <p className="mt-2 text-sm text-slate-600">{item.content.length > 120 ? `${item.content.slice(0, 120)}...` : item.content}</p>
                      </div>
                      <div className="space-y-1 text-right text-xs text-slate-500">
                        <p>{item.status}</p>
                        <p>{item.createdAt.toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <section className="grid gap-6 md:grid-cols-3">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Capture more feedback</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Add customer feedback from email, web, social, and calls to build a single source of truth.
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Prioritize themes</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Track what matters most to users by organizing feedback into themes and status categories.
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Share insights</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Generate quick overviews and keep stakeholders aligned with the latest change requests.
              </p>
            </div>
          </section>
        </section>
      </div>
    </div>
  )
}
