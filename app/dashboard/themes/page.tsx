import { redirect } from "next/navigation"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "../../../lib/nextauth"

export default async function ThemesPage() {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="space-y-8 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Themes</h1>
        <p className="mt-4 text-slate-600">Track recurring customer issues and categorize feedback by theme.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Theme analysis</h2>
          <p className="mt-3 text-sm text-slate-500">This section helps you organize feedback by topics such as reliability, onboarding, or pricing.</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Next steps</h2>
          <ul className="mt-3 space-y-3 text-sm text-slate-600">
            <li>Connect customer feedback to common themes.</li>
            <li>Measure which issues appear most frequently.</li>
            <li>Use themes to prioritize product improvements.</li>
          </ul>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">No themes yet</h2>
            <p className="mt-2 text-sm text-slate-500">Create themes from the feedback inbox to start grouping similar requests.</p>
          </div>
          <Link href="/dashboard/feedback" className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Review feedback
          </Link>
        </div>
      </div>
    </div>
  )
}
