import Link from "next/link"
import SignOutButton from "../_components/SignOutButton"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-16">
      <div className="grid gap-10 xl:grid-cols-[260px_1fr]">
        <aside className="space-y-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Workspace</p>
            <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
          </div>

          <nav className="space-y-2 pt-6">
            <Link href="/dashboard" className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
              Overview
            </Link>
            <Link href="/dashboard/feedback" className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
              Feedback inbox
            </Link>
            <Link href="/dashboard/themes" className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
              Themes
            </Link>
            <Link href="/dashboard/themes/trends" className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
              Theme trends
            </Link>
            <Link href="/dashboard/analytics" className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
              Analytics
            </Link>
            <Link href="/dashboard/ask-loop" className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
              Ask LOOP
            </Link>
            <Link href="/dashboard/reports" className="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900">
              Reports
            </Link>
          </nav>

          <SignOutButton />
        </aside>

        <div>{children}</div>
      </div>
    </div>
  )
}
