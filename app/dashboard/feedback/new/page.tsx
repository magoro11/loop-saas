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
    <div className="py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Create feedback</h1>
        <p className="mt-2 text-sm text-slate-600">Add a new customer feedback item to your workspace.</p>
      </div>
      <NewFeedbackForm />
    </div>
  )
}
