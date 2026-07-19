import type { Session } from "next-auth"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../lib/nextauth"
import SignOutButton from "./_components/SignOutButton"
import LandingPage from "./_components/LandingPage"
import { prisma } from "../lib/prisma"

const pillars = [
  {
    eyebrow: "Capture",
    title: "Capture every signal",
    description:
      "Collect feedback from email, support tickets, app reviews, NPS surveys, social, and sales calls into one workspace-scoped feed — no more context switching between tools.",
  },
  {
    eyebrow: "Classify",
    title: "Classify into themes",
    description:
      "Group related feedback into named themes with confidence scores and sentiment tags. See the shape of customer opinion instead of reading one message at a time.",
  },
  {
    eyebrow: "Query",
    title: "Query with grounded answers",
    description:
      "Ask plain-language questions and get answers that cite specific feedback records. Every claim points back to the actual customer message behind it.",
  },
]

const valueProps = [
  {
    eyebrow: "Structure",
    title: "Structure that stays consistent",
    description:
      "Feedback is organized into themes that evolve with your product so answers don't change every time you run the same query.",
  },
  {
    eyebrow: "Context",
    title: "Customer context that holds",
    description:
      "Every answer is tied to who it came from, what part of the product it relates to, and how important it is.",
  },
  {
    eyebrow: "Feedback loop",
    title: "Feedback loop that proves impact",
    description:
      "Track what changed after every decision — from ticket volume to retention — so you know what actually worked.",
  },
]

const questions = [
  "What patterns show up before a customer churns?",
  "Why are customers contacting support for the same issue three times?",
  "What feedback is blocking adoption for our highest-value features?",
  "Did fixing onboarding actually improve retention, or did we ship a red herring?",
]

const infrastructure = [
  {
    eyebrow: "Workspaces",
    title: "Multi-tenant Workspaces",
    description:
      "Every query is scoped to a workspace boundary. Feedback, themes, and reports never leak between tenants, even when the data lives in the same Postgres database.",
  },
  {
    eyebrow: "Grounding",
    title: "Retrieval-Grounded Q&A",
    description:
      "Answers cite specific feedback items rather than hallucinating. The groundwork is built for embeddings and pgvector so grounded answers become a first-class feature.",
  },
  {
    eyebrow: "Reporting",
    title: "Numbers Before Narrative",
    description:
      "Metrics are computed from stored facts — theme counts, sentiment signals, and time-series data — before any summary is generated. Reporting stays accurate as data grows.",
  },
]

const signalTypes = [
  {
    eyebrow: "Customer Intelligence",
    title: "Prioritize what to build",
    description: "Prioritize based on what drives retention, revenue, and product demand across all customer feedback.",
  },
  {
    eyebrow: "Support Intelligence",
    title: "Resolve what drives volume",
    description: "Resolve what's driving ticket volume and repeat contacts across all support interactions to close the loop.",
  },
  {
    eyebrow: "Sales Intelligence",
    title: "Fix what blocks revenue",
    description: "Fix what's blocking revenue and capture product demand from sales conversations and customer conversations.",
  },
  {
    eyebrow: "Market Intelligence",
    title: "Win where needs shift",
    description: "Win where customer needs and competitors are shifting using external reviews, social, and market signals.",
  },
]

const workflowSteps = [
  {
    step: "01",
    title: "Ingest feedback",
    description: "Capture structured and unstructured signals from every customer touchpoint.",
  },
  {
    step: "02",
    title: "Structure themes",
    description: "Organize raw feedback into reusable themes with sentiment and context attached.",
  },
  {
    step: "03",
    title: "Query & report",
    description: "Ask questions grounded in real data and generate reports tied to specific evidence.",
  },
]

const customerLogos = ["Notion", "Linear", "Stripe", "Vercel", "Slack"]

const featuredStory = {
  title: "How teams turn feedback into revenue",
  quote: "With LOOP connected to our customer feedback, we can draw a direct line from customer problems to product impact. We can literally say: these users have written in more than five times this month, this is a likely churn risk, and that we need to fix it before it affects retention.",
  author: "Product Lead",
  company: "Series-B SaaS",
}

const storyStats = [
  { value: "9x", label: "growth from mapping feedback to outcomes" },
  { value: "80%", label: "faster insight-to-decision time" },
]

const proofStats = [
  { value: "Workspace isolation", label: "Every query scoped by tenant boundary" },
  { value: "Schema-ready", label: "Embedding + pgvector structure in place" },
  { value: "Audit trail", label: "Full role and claim history preserved" },
]

const faqs = [
  {
    question: "Can't I just paste my feedback into ChatGPT?",
    answer:
      "You can. The difference is that LOOP's answers cite specific feedback records stored in your workspace, and every query is scoped to your tenant boundary. ChatGPT generates a fresh summary each time; LOOP retrieves from a structured layer that stays consistent as you add more data. The grounding layer is what turns a one-off answer into something your whole team can rely on.",
  },
  {
    question: "How is this different from tagging feedback in Notion or Sheets?",
    answer:
      "Spreadsheets and notes are manual. LOOP automatically classifies incoming feedback into themes with confidence scores, stores embeddings for retrieval, and keeps every answer tied to the original record. The difference shows up when you have hundreds or thousands of signals — searching a spreadsheet doesn't surface the same connections that a retrieval layer does.",
  },
  {
    question: "Is LOOP production-ready or still in development?",
    answer:
      "LOOP is a portfolio-scale project, not an enterprise product. The core data layer is functional: workspace isolation, theme classification, embedding storage, and basic reports all work. The roadmap includes retrieval-grounded Q&A, richer reporting, and workflow integrations. If you want to evaluate it as a working prototype, it's ready. If you need SLA-backed uptime and custom onboarding, that's not what this is.",
  },
  {
    question: "How does LOOP handle data privacy and tenant isolation?",
    answer:
      "Every database query is scoped by workspaceId. Foreign-key cascades and strict ORM-level filtering prevent cross-tenant leakage. Roles (ADMIN, ANALYST, VIEWER) are stored per user and ready for enforcement once RBAC is added in Phase 2.",
  },
]

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-3xl border border-slate-200 bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between p-6 text-left">
        <span className="text-base font-semibold text-slate-900">{question}</span>
        <svg
          className="h-5 w-5 flex-shrink-0 text-slate-400 transition group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="px-6 pb-6 text-sm leading-7 text-slate-600">{answer}</div>
    </details>
  )
}

export default async function Page() {
  const session = (await getServerSession(authOptions)) as Session | null

  if (!session?.user) {
    return <LandingPage />
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
    <div className="min-h-screen bg-[#0B1014]">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
            LOOP
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm font-medium text-slate-700 transition hover:text-slate-900">
              Dashboard
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-[2.5rem] border border-slate-200 bg-slate-950 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.12)] sm:p-10 lg:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <p className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">
                Welcome back, {session.user.name ?? session.user.email}
              </p>
              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Your workspace is ready for the next insight.
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-300">
                Keep collecting feedback, organizing themes, and exploring grounded answers in one place.
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                  Open dashboard
                </Link>
                <Link href="/dashboard/feedback/new" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                  Add feedback
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Feedback</p>
                  <p className="mt-4 text-3xl font-semibold text-white">{feedbackCount}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Themes</p>
                  <p className="mt-4 text-3xl font-semibold text-white">{themeCount}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-400">Reports</p>
                  <p className="mt-4 text-3xl font-semibold text-white">{reportCount}</p>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Signal overview</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">Recent feedback</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">Review the latest customer input that needs attention.</p>
              <div className="mt-6">
                <Link href="/dashboard/feedback" className="text-sm font-semibold text-slate-900 transition hover:text-slate-700">
                  View all feedback
                </Link>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Quick start</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link href="/dashboard/feedback/new" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center transition hover:border-slate-300">
                  <p className="text-sm font-semibold text-slate-900">Add feedback</p>
                  <p className="mt-1 text-xs text-slate-500">Log a new signal</p>
                </Link>
                <Link href="/dashboard/themes" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center transition hover:border-slate-300">
                  <p className="text-sm font-semibold text-slate-900">Browse themes</p>
                  <p className="mt-1 text-xs text-slate-500">View categorized topics</p>
                </Link>
                <Link href="/dashboard/reports" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center transition hover:border-slate-300">
                  <p className="text-sm font-semibold text-slate-900">Generate reports</p>
                  <p className="mt-1 text-xs text-slate-500">Export evidence-backed insights</p>
                </Link>
                <Link href="/dashboard" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center transition hover:border-slate-300">
                  <p className="text-sm font-semibold text-slate-900">Dashboard</p>
                  <p className="mt-1 text-xs text-slate-500">Overview and stats</p>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="rounded-[2.5rem] border border-slate-200 bg-slate-50 p-8 shadow-sm sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Proof points</p>
              <div className="mt-6 grid gap-6 sm:grid-cols-3">
                {proofStats.map((stat) => (
                  <div key={stat.label}>
                    <p className="text-lg font-semibold text-slate-900">{stat.value}</p>
                    <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
