import type { Session } from "next-auth"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../lib/nextauth"
import { prisma } from "../lib/prisma"

const featureCards = [
  {
    eyebrow: "Capture",
    title: "Bring every signal together",
    description:
      "Collect feedback from web, chat, email, and support so your team sees the full picture in one place.",
  },
  {
    eyebrow: "Understand",
    title: "Surface the themes that matter",
    description:
      "Organize feedback into clear themes, urgency levels, and product opportunities without the manual grind.",
  },
  {
    eyebrow: "Act",
    title: "Turn insight into momentum",
    description:
      "Share concise summaries with product and leadership teams so decisions are faster and better informed.",
  },
]

const proofPoints = [
  { value: "4.9/5", label: "average team satisfaction" },
  { value: "37h", label: "saved each week on reporting" },
  { value: "98%", label: "feedback routed to the right team" },
]

const workflowSteps = [
  "Collect structured and unstructured feedback",
  "Group it into themes with clear urgency",
  "Share executive-ready insights every week",
]

const signalBars = [
  { label: "Onboarding", height: "78%" },
  { label: "Reliability", height: "62%" },
  { label: "Billing", height: "84%" },
  { label: "Integrations", height: "58%" },
]

const priorityThemes = [
  { title: "Billing friction", detail: "Customers are asking for clearer invoices and upgrade clarity.", tag: "High impact" },
  { title: "Setup confusion", detail: "Several new users are stalling during onboarding and setup.", tag: "Needs action" },
  { title: "Reliability concerns", detail: "Support volume is rising around failed workflows and slow responses.", tag: "Watchlist" },
]

const logoRow = ["Notion", "Linear", "Stripe", "Vercel", "Slack"]

const quoteCards = [
  {
    title: "Spot the story behind the signal",
    description:
      "Turn hundreds of comments into a clear narrative your product team can act on in minutes.",
  },
  {
    title: "Keep leadership in sync",
    description:
      "Share weekly summaries that explain what customers are asking for and why it matters.",
  },
  {
    title: "Move faster with confidence",
    description:
      "Prioritize the right opportunities with a consistent framework for product decisions.",
  },
]

export default async function Page() {
  const session = (await getServerSession(authOptions)) as Session | null

  if (!session?.user) {
    return (
      <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:gap-10">
          <section className="overflow-hidden rounded-[2.25rem] border border-slate-200 bg-white shadow-[0_30px_120px_rgba(15,23,42,0.08)]">
            <div className="grid gap-10 px-8 py-10 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-14 lg:py-14">
              <div className="max-w-2xl">
                <p className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-600">
                  Customer feedback intelligence
                </p>
                <h1 className="mt-6 text-4xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-5xl lg:text-6xl">
                  Understand what customers mean, fast.
                </h1>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  LOOP turns raw feedback into clear product signals, so your team can spot themes, prioritize decisions, and move with confidence.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    Get started
                  </Link>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-7 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                  >
                    Explore the dashboard
                  </Link>
                </div>

                <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-500">
                  <span className="rounded-full bg-slate-100 px-3 py-1">Real-time summaries</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">Cross-functional reporting</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1">Built for product teams</span>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Live insight feed</p>
                    <p className="mt-2 text-xl font-semibold">The signal your team sees</p>
                  </div>
                  <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm font-medium text-emerald-300">
                    Synced now
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {proofPoints.map((point) => (
                    <div key={point.label} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                      <p className="text-2xl font-semibold">{point.value}</p>
                      <p className="mt-1 text-sm text-slate-300">{point.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">Signal overview</p>
                  <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-slate-900">What customers are asking for this week</h2>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">+18% momentum</div>
              </div>

              <div className="mt-8 flex h-44 items-end gap-3">
                {signalBars.map((bar) => (
                  <div key={bar.label} className="flex flex-1 flex-col items-center justify-end gap-3">
                    <div className="w-full rounded-t-[1rem] bg-gradient-to-t from-slate-900 via-slate-700 to-slate-400" style={{ height: bar.height }} />
                    <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">{bar.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_25px_80px_rgba(15,23,42,0.12)] sm:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Priority themes</p>
              <div className="mt-6 space-y-4">
                {priorityThemes.map((theme) => (
                  <div key={theme.title} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-semibold text-white">{theme.title}</h3>
                      <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-200">
                        {theme.tag}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-300">{theme.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            {featureCards.map((card) => (
              <div key={card.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">{card.eyebrow}</p>
                <h2 className="mt-4 text-xl font-semibold text-slate-900">{card.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-600">{card.description}</p>
              </div>
            ))}
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm sm:p-10">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">Why teams switch</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-4xl">
                  A sharper way to understand customer needs.
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="text-lg font-semibold text-slate-900">Prioritize faster</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">See the feedback with the highest product impact so your roadmap stays grounded.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <h3 className="text-lg font-semibold text-slate-900">Keep everyone aligned</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">Turn scattered requests into shared themes and clear ownership across teams.</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:col-span-2">
                  <h3 className="text-lg font-semibold text-slate-900">Launch with clarity</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">Use concise summaries and trend reports to brief stakeholders before every release.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">How it works</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-slate-900">From feedback to action in three simple steps.</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {workflowSteps.map((step, index) => (
                  <div key={step} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
                    <span className="mr-2 font-semibold text-slate-900">0{index + 1}</span>
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-slate-950 px-8 py-10 text-white shadow-[0_25px_80px_rgba(15,23,42,0.12)] sm:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-400">Trusted by modern product teams</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-white sm:text-4xl">
                  See the signal behind the noise.
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {logoRow.map((logo) => (
                  <div key={logo} className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-200">
                    {logo}
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">Why teams love LOOP</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-slate-900 sm:text-4xl">
                Clarity for every stakeholder, from product to leadership.
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Product, support, and leadership can finally work from the same narrative instead of chasing fragmented feedback across tools.
              </p>
            </div>
            <div className="grid gap-4">
              {quoteCards.map((card) => (
                <div key={card.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{card.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-slate-500">Ready to see it live?</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-slate-900">Start collecting product insight in minutes.</h2>
              </div>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Start free
              </Link>
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
    <div className="min-h-screen px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 lg:gap-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:p-10 lg:p-12">
          <div className="mx-auto max-w-4xl text-center">
            <p className="inline-flex rounded-full bg-slate-100 px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-slate-700">
              Welcome back, {session.user.name ?? session.user.email}
            </p>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Your workspace is ready for the next product insight.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              Keep collecting feedback, organizing themes, and sharing the latest product story with your team.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
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

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
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
                <p className="mt-2 text-sm text-slate-500">Review the latest customer input that needs attention.</p>
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
                Pull customer voice from every channel into a single, searchable source of truth.
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Prioritize themes</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Group requests into themes and keep the roadmap focused on the biggest opportunities.
              </p>
            </div>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">Share insights</h2>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                Turn feedback into crisp updates that help product, support, and leadership move together.
              </p>
            </div>
          </section>
        </section>
      </div>
    </div>
  )
}
