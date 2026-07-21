import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "../../../../lib/nextauth"
import NewFeedbackForm from "./NewFeedbackForm"

export default async function NewFeedbackPage() {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Feedback inbox</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-slate-900">Create feedback</h1>
        <p className="mt-4 max-w-2xl text-slate-600">Add a new customer feedback item to your workspace.</p>
      </div>
      <NewFeedbackForm />
    </div>
  )
}
