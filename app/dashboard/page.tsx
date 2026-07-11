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
                <p className="mt-2 text-sm text-slate-500">See which themes are gaining traction and which opportunities deserve the next move.</p>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">+14% this week</div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-36 items-end gap-3">
                  {["78%", "62%", "84%", "58%"].map((height, index) => (
                    <div key={height} className="flex flex-1 flex-col items-center justify-end gap-2">
                      <div className="w-full rounded-t-[0.9rem] bg-gradient-to-t from-slate-900 via-slate-700 to-slate-400" style={{ height }} />
                      <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">{["Onboarding", "Reliability", "Billing", "Integrations"][index]}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
                  <span>Weekly momentum</span>
                  <span>6 themes flagged</span>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { title: "Billing friction", detail: "Customers need clearer invoices and upgrading paths.", tag: "High impact" },
                  { title: "Setup confusion", detail: "New users are stalling in the first product experience.", tag: "Needs action" },
                  { title: "Reliability concerns", detail: "Support volume is rising around failed workflows.", tag: "Watchlist" },
                ].map((item) => (
                  <div key={item.title} className="rounded-[1.25rem] border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">{item.tag}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
