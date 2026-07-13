import type { Session } from "next-auth"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../lib/nextauth"
import SignOutButton from "./_components/SignOutButton"
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
    return (
      <div className="min-h-screen bg-[#0B1014]">
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-xl font-bold tracking-tight text-slate-900">
              LOOP
            </Link>
            <nav className="hidden items-center gap-8 md:flex">
              <Link href="#pillars" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
                Platform
              </Link>
              <Link href="#infrastructure" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
                Infrastructure
              </Link>
              <Link href="#how-it-works" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
                How it works
              </Link>
              <Link href="#faq" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
                FAQ
              </Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-slate-900 transition hover:text-slate-700">
                Sign in
              </Link>
              <Link href="/signup" className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                Get started
              </Link>
            </div>
          </div>
        </header>

        <main>
          <section className="relative overflow-hidden bg-[#0B1014] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
            <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
            <div className="pointer-events-none absolute right-0 top-0 h-[32rem] w-[32rem] rounded-full bg-emerald-500/15 blur-3xl" />
            <img
              src="https://cdn.prod.website-files.com/69e6b779dbc68d6b76294ae1/69e737afdcf9789de39561db_top-bg.webp"
              alt=""
              className="hero-bg-top"
              sizes="100vw"
              srcSet="https://cdn.prod.website-files.com/69e6b779dbc68d6b76294ae1/69e737afdcf9789de39561db_top-bg-p-500.webp 500w, https://cdn.prod.website-files.com/69e6b779dbc68d6b76294ae1/69e737afdcf9789de39561db_top-bg-p-800.webp 800w, https://cdn.prod.website-files.com/69e6b779dbc68d6b76294ae1/69e737afdcf9789de39561db_top-bg-p-1080.webp 1080w, https://cdn.prod.website-files.com/69e6b779dbc68d6b76294ae1/69e737afdcf9789de39561db_top-bg-p-1600.webp 1600w, https://cdn.prod.website-files.com/69e6b779dbc68d6b76294ae1/69e737afdcf9789de39561db_top-bg-p-2000.webp 2000w, https://cdn.prod.website-files.com/69e6b779dbc68d6b76294ae1/69e737afdcf9789de39561db_top-bg.webp 2400w"
            />
            <img
              src="https://cdn.prod.website-files.com/69e6b779dbc68d6b76294ae1/69e737d2c165c35a5dec8255_stars.png"
              alt=""
              className="hero-bg-stars"
              sizes="100vw"
              srcSet="https://cdn.prod.website-files.com/69e6b779dbc68d6b76294ae1/69e737d2c165c35a5dec8255_stars-p-500.png 500w, https://cdn.prod.website-files.com/69e6b779dbc68d6b76294ae1/69e737d2c165c35a5dec8255_stars-p-800.png 800w, https://cdn.prod.website-files.com/69e6b779dbc68d6b76294ae1/69e737d2c165c35a5dec8255_stars-p-1080.png 1080w, https://cdn.prod.website-files.com/69e6b779dbc68d6b76294ae1/69e737d2c165c35a5dec8255_stars-p-1600.png 1600w, https://cdn.prod.website-files.com/69e6b779dbc68d6b76294ae1/69e737d2c165c35a5dec8255_stars-p-2000.png 2000w, https://cdn.prod.website-files.com/69e6b779dbc68d6b76294ae1/69e737d2c165c35a5dec8255_stars-p-2600.png 2600w, https://cdn.prod.website-files.com/69e6b779dbc68d6b76294ae1/69e737d2c165c35a5dec8255_stars.png 2902w"
            />
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <p className="relative z-10 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                  Customer feedback intelligence
                </p>
                <h1 className="relative z-10 mx-auto mt-8 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-7xl">
                  AI can already read your feedback. The hard part is knowing what to act on.
                </h1>
                <p className="relative z-10 mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                  LOOP classifies, clusters, and retrieves grounded answers from your actual feedback — so you stop guessing what matters and start acting on evidence.
                </p>
                <div className="relative z-10 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/signup" className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                    Get started
                  </Link>
                  <Link href="#pillars" className="rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
                    Explore the platform
                  </Link>
                </div>
              </div>
            </div>
            <div className="relative z-10 mx-auto mt-20 max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-teal-950/40 backdrop-blur-xl sm:p-8">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(rgba(148,163,184,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.15) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1000 360" fill="none" preserveAspectRatio="none" aria-hidden="true">
                <path d="M150 250 C300 80 360 100 500 180 S740 80 860 130" stroke="#67E8F9" strokeOpacity=".55" strokeWidth="1.5" />
                <path d="M120 120 C300 260 420 260 500 180 S700 220 900 270" stroke="white" strokeOpacity=".25" strokeWidth="1" />
                <path d="M500 180 C520 100 590 65 700 80" stroke="#14B8A6" strokeOpacity=".5" strokeWidth="1.5" />
              </svg>
              <div className="relative grid min-h-[310px] grid-cols-2 items-center gap-6 sm:grid-cols-4">
                {["Signals", "Intelligence", "Context", "Outcomes"].map((node, index) => (
                  <div key={node} className={`group flex flex-col items-center ${index % 2 ? "sm:translate-y-12" : "sm:-translate-y-8"}`}>
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-cyan-200/50 bg-[#0B1014]/80 shadow-[0_0_35px_rgba(20,184,166,.45)]"><span className="h-3 w-3 rounded-full bg-cyan-200 shadow-[0_0_18px_#67E8F9]" /><span className="absolute inset-2 rounded-full border border-teal-300/20" /></div>
                    <span className="mt-4 text-sm font-medium text-white">{node}</span><span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">AI layer 0{index + 1}</span>
                  </div>
                ))}
              </div>
              <div className="relative mt-2 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md"><p className="text-[10px] uppercase tracking-widest text-slate-400">AI insight</p><p className="mt-2 text-sm text-white">Onboarding friction is rising for high-value accounts.</p></div><div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md"><p className="text-[10px] uppercase tracking-widest text-slate-400">Sentiment</p><p className="mt-2 text-2xl font-semibold text-emerald-300">+18.4%</p></div><div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md"><p className="text-[10px] uppercase tracking-widest text-slate-400">Workflow agent</p><p className="mt-2 text-sm text-white">3 actions completed <span className="text-emerald-300">●</span></p></div></div>
            </div>
            <div className="relative z-10 mt-16 flex flex-wrap justify-center gap-6 opacity-60 sm:gap-10">
              {customerLogos.map((logo) => (
                <span key={logo} className="text-sm font-medium uppercase tracking-widest text-slate-400">
                  {logo}
                </span>
              ))}
            </div>
          </section>

          <section className="border-b border-slate-200 bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    AI-accelerated customer analysis.
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    It is still hard knowing what to fix or build next.
                  </h2>
                  <p className="mt-6 text-lg leading-8 text-slate-600">
                    LOOP maintains the structure, context, and evidence teams need to prioritize what affects churn, NPS, CSAT, expansion, and roadmap decisions — grounded in real data.
                  </p>
                  <div className="mt-8">
                    <Link href="#infrastructure" className="inline-flex items-center text-sm font-semibold text-slate-900 transition hover:text-slate-700">
                      See how it works under the hood
                      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Sample questions LOOP is built to answer
                  </p>
                  <ul className="mt-6 space-y-3">
                    {questions.map((question) => (
                      <li key={question} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <span className="mt-[2px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400" />
                        <span className="text-base leading-7 text-slate-700">{question}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Link href="/signup" className="inline-flex items-center text-sm font-semibold text-slate-900 transition hover:text-slate-700">
                      Try on your data
                      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="intelligence" className="bg-[#0B1014] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">One customer intelligence layer</p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">See the signal. Prove the impact.</h2>
                  <p className="mt-5 text-lg leading-8 text-slate-600">Connect every conversation to the outcomes your teams care about — then turn insight into action with AI workflows.</p>
                </div>
                <Link href="/signup" className="inline-flex h-fit rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800">Explore intelligence</Link>
              </div>
              <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Customer intelligence", metric: "82%", detail: "retention confidence", color: "bg-emerald-400", bars: [35, 52, 44, 68, 58, 82] },
                  { label: "Support intelligence", metric: "−31%", detail: "repeat contact rate", color: "bg-sky-400", bars: [76, 64, 69, 52, 44, 31] },
                  { label: "Sales intelligence", metric: "$2.4M", detail: "revenue at risk found", color: "bg-violet-400", bars: [28, 42, 38, 57, 63, 78] },
                  { label: "Market intelligence", metric: "+24%", detail: "share of voice", color: "bg-orange-400", bars: [32, 36, 49, 45, 61, 74] },
                ].map((card) => (
                  <div key={card.label} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center justify-between"><span className="text-sm font-semibold text-slate-700">{card.label}</span><span className={`h-2.5 w-2.5 rounded-full ${card.color}`} /></div>
                    <p className="mt-7 text-3xl font-semibold tracking-tight text-slate-950">{card.metric}</p>
                    <p className="mt-1 text-sm text-slate-500">{card.detail}</p>
                    <div className="mt-7 flex h-16 items-end gap-2">{card.bars.map((height, index) => <span key={index} className={`flex-1 rounded-t-md ${card.color} opacity-${index + 3}`} style={{ height: `${height}%` }} />)}</div>
                    <div className="mt-3 flex justify-between text-[10px] uppercase tracking-widest text-slate-400"><span>Jan</span><span>Jun</span></div>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
                <div className="rounded-[1.75rem] bg-slate-950 p-7 text-white sm:p-9">
                  <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">Build AI workflows & agents</p><h3 className="mt-3 text-2xl font-semibold">From insight to action, automatically.</h3></div><span className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300">Live workflow</span></div>
                  <div className="mt-8 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-white/10 p-4"><span className="text-xs text-slate-400">Trigger</span><p className="mt-2 text-sm font-medium">Churn risk detected</p></div><div className="rounded-2xl bg-emerald-400/20 p-4"><span className="text-xs text-emerald-200">AI agent</span><p className="mt-2 text-sm font-medium">Drafts a response</p></div><div className="rounded-2xl bg-white/10 p-4"><span className="text-xs text-slate-400">Action</span><p className="mt-2 text-sm font-medium">Creates a Jira ticket</p></div></div>
                </div>
                <div className="rounded-[1.75rem] border border-slate-200 bg-white p-7"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Connected context</p><p className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">220M+</p><p className="mt-2 text-sm leading-6 text-slate-600">signals ready for your teams, copilots, and agents.</p><div className="mt-6 flex -space-x-2"><span className="h-9 w-9 rounded-full border-2 border-white bg-emerald-300" /><span className="h-9 w-9 rounded-full border-2 border-white bg-sky-300" /><span className="h-9 w-9 rounded-full border-2 border-white bg-violet-300" /><span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-slate-900 text-xs text-white">+8</span></div></div>
              </div>
            </div>
          </section>

          <section id="pillars" className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  From raw signals to structured insight
                </h2>
              </div>
              <div className="mt-16 grid gap-8 lg:grid-cols-3">
                {pillars.map((pillar) => (
                  <div key={pillar.eyebrow} className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_1px_3px_rgba(15,23,42,0.08)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{pillar.eyebrow}</p>
                    <h3 className="mt-4 text-xl font-semibold text-slate-900">{pillar.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{pillar.description}</p>
                    <span className="absolute top-8 right-8 text-2xl text-slate-200">+</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8 lg:pb-24">
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  From one-off answers to a system your team runs on
                </h2>
              </div>
              <div className="mt-16 grid gap-8 lg:grid-cols-3">
                {valueProps.map((item) => (
                  <div key={item.title} className="relative rounded-3xl border border-slate-200 bg-slate-50 p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.eyebrow}</p>
                    <h3 className="mt-4 text-xl font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
                    <span className="absolute top-8 right-8 text-2xl text-slate-200">+</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="infrastructure" className="bg-slate-950 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Powered by real infrastructure
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  The hard problems solved under the hood
                </h2>
              </div>
              <div className="mt-16 grid gap-8 lg:grid-cols-3">
                {infrastructure.map((item) => (
                  <div key={item.title} className="rounded-3xl border border-white/10 bg-white/5 p-8">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{item.eyebrow}</p>
                    <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="how-it-works" className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  How LOOP works
                </h2>
              </div>
              <div className="mt-16 grid gap-8 lg:grid-cols-3">
                {workflowSteps.map((item) => (
                  <div key={item.step} className="relative rounded-3xl border border-slate-200 bg-slate-50 p-8">
                    <span className="text-sm font-semibold text-slate-400">{item.step}</span>
                    <h3 className="mt-4 text-xl font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                  Built for every signal in the customer journey
                </h2>
              </div>
              <div className="mt-16 grid gap-8 lg:grid-cols-4">
                {signalTypes.map((signal) => (
                  <div key={signal.eyebrow} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{signal.eyebrow}</p>
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{signal.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{signal.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="border-t border-slate-200 bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Customer stories</p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                    How leading teams operationalize customer understanding
                  </h2>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {customerLogos.map((logo) => (
                      <span key={logo} className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
                        {logo}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  {storyStats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
                      <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
                    </div>
                  ))}
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
                    <p className="text-base leading-7 text-slate-700">"{featuredStory.quote}"</p>
                    <div className="mt-6">
                      <p className="text-sm font-semibold text-slate-900">{featuredStory.author}</p>
                      <p className="text-sm text-slate-500">{featuredStory.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="border-b border-slate-200 bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <div className="text-center">
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Frequently asked questions</h2>
              </div>
              <div className="mt-10 space-y-4">
                {faqs.map((faq) => (
                  <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Ready to build the feedback layer your product team deserves?
              </h2>
              <p className="mt-6 text-lg leading-8 text-slate-600">
                Start ingesting feedback, organizing themes, and querying grounded answers — in minutes.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/signup" className="rounded-full bg-slate-900 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Start free
                </Link>
                <Link href="/login" className="rounded-full border border-slate-200 bg-white px-8 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                  View demo
                </Link>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-slate-500">LOOP — Customer Feedback Intelligence</p>
              <p className="text-sm text-slate-400">Built as a portfolio project</p>
            </div>
          </div>
        </footer>
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
