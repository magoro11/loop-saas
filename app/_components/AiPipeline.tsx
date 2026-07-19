"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  MessageSquare,
  Phone,
  FileText,
  BarChart3,
  Heart,
  MessageCircle,
  Sparkles,
  Brain,
  Tag,
  Activity,
  Users,
  Package,
  GitBranch,
  Zap,
  ArrowRight,
  RefreshCw,
  TrendingUp,
} from "lucide-react"

const sections = [
  {
    id: "signals",
    title: "Signals",
    subtitle: "Ingest every customer touchpoint",
    icon: Zap,
    color: "from-sky-400 to-cyan-400",
    items: [
      { icon: MessageSquare, label: "Tickets", desc: "Support conversations" },
      { icon: Phone, label: "Calls", desc: "Sales & success calls" },
      { icon: FileText, label: "Surveys", desc: "NPS & CSAT responses" },
      { icon: BarChart3, label: "Product Usage", desc: "In-app behavioral data" },
      { icon: MessageCircle, label: "Social", desc: "Twitter, LinkedIn, Reddit" },
      { icon: MessageSquare, label: "App Reviews", desc: "App store feedback" },
    ],
  },
  {
    id: "intelligence",
    title: "Intelligence",
    subtitle: "Turn noise into structured insight",
    icon: Brain,
    color: "from-violet-400 to-purple-400",
    items: [
      { icon: Tag, label: "Theme & Taxonomy", desc: "Auto-cluster feedback" },
      { icon: Heart, label: "Sentiment", desc: "Emotion detection per signal" },
      { icon: Activity, label: "Trends", desc: "Temporal pattern analysis" },
      { icon: Sparkles, label: "AI Reasoning", desc: "Grounded explanations" },
    ],
  },
  {
    id: "context",
    title: "Context",
    subtitle: "Attach meaning to every signal",
    icon: Users,
    color: "from-emerald-400 to-teal-400",
    items: [
      { icon: Users, label: "Customer Segment", desc: "ICP & tier mapping" },
      { icon: Package, label: "Product Feature", desc: "Module & capability tags" },
      { icon: GitBranch, label: "Lifecycle Stage", desc: "Onboarding to renewal" },
      { icon: BarChart3, label: "Use Case", desc: "Job-to-be-done labels" },
      { icon: Zap, label: "Plan", desc: "Pricing tier context" },
    ],
  },
  {
    id: "outcomes",
    title: "Outcomes",
    subtitle: "Connect feedback to revenue",
    icon: TrendingUp,
    color: "from-amber-400 to-orange-400",
    items: [
      { icon: TrendingUp, label: "Feature Adoption", desc: "Usage correlation" },
      { icon: Zap, label: "Revenue Impact", desc: "ARR influence scoring" },
      { icon: GitBranch, label: "Roadmap Priority", desc: "Evidence-based ranking" },
      { icon: Activity, label: "Churn Risk", desc: "Early warning signals" },
      { icon: BarChart3, label: "Win Rate", desc: "Deal outcome prediction" },
    ],
  },
]

const streamingEvents = [
  { source: "Zendesk", type: "ticket", text: "Billing issue reported — Enterprise plan", time: "2s ago" },
  { source: "Gong", type: "call", text: "Renewal risk flagged on expansion call", time: "5s ago" },
  { source: "App Store", type: "review", text: "1-star review: onboarding is confusing", time: "8s ago" },
  { source: "Mixpanel", type: "usage", text: "Drop-off detected in onboarding flow", time: "12s ago" },
  { source: "Twitter", type: "social", text: "Viral complaint about API latency", time: "15s ago" },
  { source: "NPS", type: "survey", text: "Detractor feedback on mobile experience", time: "18s ago" },
]

export default function AiPipeline() {
  const [events, setEvents] = useState(streamingEvents.slice(0, 3))
  const [activeSection, setActiveSection] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setEvents((prev) => {
        const next = [...prev]
        const newEvent = streamingEvents[Math.floor(Math.random() * streamingEvents.length)]
        next.unshift({ ...newEvent, time: "just now" })
        return next.slice(0, 4)
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-20 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-400"
        >
          The AI layer for customer intelligence
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          From raw signals to
          <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
            {" "}
            revenue decisions
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400"
        >
          LOOP connects every customer conversation to the outcomes your teams care about — then turns insight into
          action with AI workflows.
        </motion.p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {sections.map((section, idx) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={() => setActiveSection(idx)}
            className="group relative cursor-pointer"
          >
            <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-white/10 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
            <div className="relative h-full rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl transition-all duration-500 group-hover:border-sky-400/30 group-hover:bg-white/[0.06]">
              <div className={`mb-4 inline-flex rounded-2xl bg-gradient-to-br ${section.color} p-2.5 shadow-[0_0_25px_rgba(56,189,248,0.25)]`}>
                <section.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">{section.title}</h3>
              <p className="mt-1 text-xs text-slate-400">{section.subtitle}</p>
              <div className="mt-5 space-y-3">
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-300">
                      <item.icon className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-16"
      >
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-1 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
              <span className="text-sm font-medium text-slate-300">Live event stream</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-widest text-slate-400">
                Real-time
              </span>
            </div>
            <RefreshCw className="h-4 w-4 text-slate-500" />
          </div>
          <div className="divide-y divide-white/5">
            <AnimatePresence mode="popLayout">
              {events.map((event, i) => (
                <motion.div
                  key={`${event.source}-${event.time}-${i}`}
                  initial={{ opacity: 0, x: -20, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, x: 20, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center justify-between px-6 py-3.5"
                >
                  <div className="flex items-center gap-4">
                    <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-sky-300">
                      {event.source}
                    </span>
                    <span className="text-sm text-slate-300">{event.text}</span>
                  </div>
                  <span className="text-xs text-slate-500">{event.time}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      <div className="mt-20 grid gap-12 lg:grid-cols-[1fr_1.25fr]">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-r from-sky-500/20 via-cyan-400/10 to-emerald-500/20 blur-3xl" />
          <div className="relative rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              <span className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400">Knowledge Graph</span>
            </div>
            <svg viewBox="0 0 400 300" className="h-64 w-full">
              <defs>
                <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                </radialGradient>
              </defs>
              {[
                { x: 200, y: 150, r: 28, label: "Feedback", color: "#38bdf8" },
                { x: 100, y: 80, r: 18, label: "Themes", color: "#a78bfa" },
                { x: 300, y: 80, r: 18, label: "Sentiment", color: "#34d399" },
                { x: 80, y: 200, r: 18, label: "Segments", color: "#fbbf24" },
                { x: 320, y: 200, r: 18, label: "Revenue", color: "#f87171" },
              ].map((node, i) => (
                <g key={i}>
                  <circle cx={node.x} cy={node.y} r={node.r + 12} fill="url(#node-glow)">
                    <animate attributeName="r" values={`${node.r + 8};${node.r + 18};${node.r + 8}`} dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={node.x} cy={node.y} r={node.r} fill={node.color} fillOpacity="0.15" stroke={node.color} strokeWidth="1.5" />
                  <text x={node.x} y={node.y + 4} textAnchor="middle" className="fill-white text-[10px] font-semibold" style={{ fontSize: 10 }}>
                    {node.label}
                  </text>
                </g>
              ))}
              <path d="M200 150 Q150 115 100 80" fill="none" stroke="rgba(56,189,248,0.3)" strokeWidth="1" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" values="0;-8" dur="2s" repeatCount="indefinite" />
              </path>
              <path d="M200 150 Q250 115 300 80" fill="none" stroke="rgba(167,139,250,0.3)" strokeWidth="1" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" values="0;-8" dur="2s" repeatCount="indefinite" />
              </path>
              <path d="M200 150 Q140 175 80 200" fill="none" stroke="rgba(52,211,153,0.3)" strokeWidth="1" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" values="0;-8" dur="2s" repeatCount="indefinite" />
              </path>
              <path d="M200 150 Q260 175 320 200" fill="none" stroke="rgba(251,191,36,0.3)" strokeWidth="1" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" values="0;-8" dur="2s" repeatCount="indefinite" />
              </path>
            </svg>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col justify-center space-y-6"
        >
          <h3 className="text-3xl font-semibold tracking-tight text-white">
            Every signal connected.
            <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
              {" "}
              Automatically.
            </span>
          </h3>
          <p className="text-base leading-7 text-slate-400">
            LOOP builds a living knowledge graph from your customer data. Themes link to segments, sentiment maps to
            revenue impact, and every connection is updated as new signals arrive.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Active connections", value: "2.4K" },
              { label: "Auto-classified", value: "98.2%" },
              { label: "Avg latency", value: "120ms" },
              { label: "Graph nodes", value: "847" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
                <p className="mt-1 text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
