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
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Theme analysis</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-slate-900">Prioritized themes</h1>
            <p className="mt-4 max-w-2xl text-slate-600">Group related feedback into durable themes and rank them by likely business impact.</p>
          </div>
          <Link href="/dashboard/feedback" className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Review feedback
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">How this works</h2>
          <p className="mt-3 text-sm text-slate-500">Each theme should capture a recurring signal, such as onboarding confusion, billing friction, or missing integrations.</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">What to look for</h2>
          <ul className="mt-3 space-y-3 text-sm text-slate-600">
            <li>• High-frequency issues with strong customer frustration.</li>
            <li>• Low-volume themes tied to high-value customers or critical workflows.</li>
            <li>• Signals that may affect churn, expansion, or support spend.</li>
          </ul>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">No themes yet</h2>
            <p className="mt-2 text-sm text-slate-500">Create themes from the feedback inbox to start grouping similar requests and surfacing priorities.</p>
          </div>
          <Link href="/dashboard/feedback" className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Review feedback
          </Link>
        </div>
      </div>
    </div>
  )
}
