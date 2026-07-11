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
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Analyst reports</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-slate-900">Decision-ready summaries</h1>
            <p className="mt-4 max-w-2xl text-slate-600">Turn structured feedback into concise insight packs for product, support, and leadership teams.</p>
          </div>
          <Link href="/dashboard/feedback" className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Go to feedback inbox
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Workspace overview</h2>
          <p className="mt-3 text-sm text-slate-500">Capture top feedback trends, recurring pain points, and the stories behind them.</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Export options</h2>
          <p className="mt-3 text-sm text-slate-500">Prepare concise summaries for stakeholders with clear recommended next actions.</p>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Ready to create your first report?</h2>
            <p className="mt-2 text-sm text-slate-500">Start by collecting feedback in the inbox, then build a clear view of the themes worth acting on.</p>
          </div>
          <Link href="/dashboard/feedback" className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Go to feedback inbox
          </Link>
        </div>
      </div>
    </div>
  )
}
