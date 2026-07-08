import { redirect } from "next/navigation"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import type { Session } from "next-auth"
import { authOptions } from "../../../lib/nextauth"
import { prisma } from "../../../lib/prisma"

export default async function FeedbackPage() {
  const session = (await getServerSession(authOptions)) as Session | null
  if (!session?.user) {
    redirect("/login")
  }

  const feedbacks = await prisma.feedback.findMany({
    where: { workspaceId: session.user.workspaceId },
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  return (
    <div className="py-16">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Feedback inbox</h1>
          <p className="mt-2 text-sm text-slate-600">Review the latest customer feedback for your workspace.</p>
        </div>
        <Link href="/dashboard/feedback/new" className="inline-flex items-center rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          Add feedback
        </Link>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Workspace summary</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{feedbacks.length} feedback items</h2>
              </div>
              <p className="text-sm text-slate-500">Latest first, up to 50 items.</p>
            </div>
          </div>

          {feedbacks.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
              <p className="text-slate-500">No feedback found yet. Add the first item to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((item) => (
                <div key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                        {item.channel}
                      </p>
                      <p className="mt-3 text-sm text-slate-600">
                        {item.content.length > 140 ? `${item.content.slice(0, 140)}...` : item.content}
                      </p>
                    </div>
                    <div className="space-y-2 text-right text-sm text-slate-500">
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-[0.16em] text-slate-600">
                        {item.status}
                      </span>
                      <p>{item.createdAt.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Quick actions</h2>
            <p className="mt-3 text-sm text-slate-500">Keep a log of the latest feedback and add new items quickly.</p>
            <Link href="/dashboard/feedback/new" className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              Create new feedback
            </Link>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Tips</h2>
            <ul className="mt-3 space-y-3 text-sm text-slate-600">
              <li>Keep feedback concise and actionable.</li>
              <li>Use channel tags to categorize user requests.</li>
              <li>Review the newest items first.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}
