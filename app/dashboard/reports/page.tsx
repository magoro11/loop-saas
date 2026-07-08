import { redirect } from "next/navigation"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "../../../lib/nextauth"

export default async function ReportsPage() {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="space-y-8 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Reports</h1>
        <p className="mt-4 text-slate-600">Generate insights and export customer feedback metrics.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Workspace overview</h2>
          <p className="mt-3 text-sm text-slate-500">View top feedback trends and productivity metrics for your team.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Export options</h2>
          <p className="mt-3 text-sm text-slate-500">Download reports for stakeholder review or share summaries with your team.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Ready to create your first report?</h2>
            <p className="mt-2 text-sm text-slate-500">Start by collecting feedback items in the inbox and then generate insights from there.</p>
          </div>
          <Link href="/dashboard/feedback" className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Go to feedback inbox
          </Link>
        </div>
      </div>
    </div>
  )
}
