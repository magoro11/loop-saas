"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import DashboardCard from "./DashboardCard"
import ExpandableCard from "./ExpandableCard"
import GlassCard from "./GlassCard"
import ParticleNetwork from "./ParticleNetwork"
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
  Play,
  TrendingUp,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

export default function LandingPage() {
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  const [points, setPoints] = useState<{ x: number; y: number }[]>(() =>
    Array.from({ length: 12 }, (_, i) => ({
      x: Math.round(50 + i * 50),
      y: Math.round(100 + Math.sin(i * 0.9) * 35 + (seededRandom(i * 7) - 0.5) * 20),
    }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints(prev => {
        const lastY = prev[prev.length - 1].y;
        const newY = Math.round(Math.max(30, Math.min(170, lastY + (Math.random() - 0.5) * 35)));
        const next = prev.map(p => ({ ...p, x: p.x - 50 }));
        next.push({ x: 550, y: newY });
        return next.slice(-12);
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  interface Point {
    x: number;
    y: number;
  }

  const buildSmoothPath = (pts: Point[]) => {
    if (pts.length < 2) return "";
    let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const dx = p1.x - p0.x;
      const cp1x = p0.x + dx * 0.4;
      const cp1y = p0.y;
      const cp2x = p1.x - dx * 0.4;
      const cp2y = p1.y;
      d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`;
    }
    return d;
  };

  const linePath = useMemo(() => buildSmoothPath(points), [points]);
  const areaPath = useMemo(() => linePath ? `${linePath} L ${points[points.length - 1].x.toFixed(2)} 200 L ${points[0].x.toFixed(2)} 200 Z` : "", [linePath, points]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <ParticleNetwork />

      <div className="relative z-10">
        <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-[#030712]/70 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
              <span className="text-xl font-bold tracking-tight text-white">LOOP</span>
            </div>
            <nav className="hidden items-center gap-8 md:flex">
              <a href="#signals" className="text-sm text-slate-400 transition hover:text-white">Signals</a>
              <a href="#intelligence" className="text-sm text-slate-400 transition hover:text-white">Intelligence</a>
              <a href="#context" className="text-sm text-slate-400 transition hover:text-white">Context</a>
              <a href="#outcomes" className="text-sm text-slate-400 transition hover:text-white">Outcomes</a>
            </nav>
            <div className="flex items-center gap-3">
              <a href="/login" className="text-sm font-medium text-slate-300 transition hover:text-white">Sign in</a>
              <a href="/signup" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                Get started
              </a>
            </div>
          </div>
        </header>

        <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
          <div className="mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-300">Now in public beta</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Turn customer feedback into
              <br />
              <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent">
                prioritized action
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-slate-400"
            >
              LOOP centralizes customer feedback across channels, applies tenant-safe classification and theme analysis,
              and surfaces what to do next.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <a href="/signup" className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                Start free
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10">
                <Play className="h-4 w-4" />
                Watch demo
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mx-auto mt-20 max-w-5xl"
            >
              <div className="relative rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-2 shadow-2xl shadow-black/40 backdrop-blur-xl">
                <div className="rounded-[2rem] border border-white/5 bg-[#0B1014] p-6">
                  <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-rose-400/80" />
                      <div className="h-3 w-3 rounded-full bg-amber-400/80" />
                      <div className="h-3 w-3 rounded-full bg-emerald-400/80" />
                    </div>
                    <span className="text-xs text-slate-500">loop.ai/dashboard</span>
                    <div className="h-4 w-4" />
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <DashboardCard title="Feedback" value="1,284" change="+12.5%" icon={MessageSquare} delay={0} />
                    <DashboardCard title="Themes" value="48" change="+4" icon={Tag} delay={0.1} />
                    <DashboardCard title="Revenue at risk" value="$48K" change="-2.1%" icon={BarChart3} delay={0.2} />
                  </div>
                  <div className="mt-4 grid gap-4 lg:grid-cols-5">
                    <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Feedback Volume</span>
                          <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-2xl font-semibold text-white">12,847</span>
                            <span className="text-xs text-emerald-400">+23.4%</span>
                          </div>
                        </div>
                        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-emerald-400">Live</span>
                      </div>
                      <svg viewBox="0 0 600 200" className="h-48 w-full" suppressHydrationWarning>
                        <defs>
                          <linearGradient id="enterpret-area" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                            <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.05" />
                            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
                          </linearGradient>
                          <linearGradient id="enterpret-line" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.9" />
                            <stop offset="100%" stopColor="#34d399" stopOpacity="1" />
                          </linearGradient>
                          <filter id="enterpret-glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>
                        <line x1="0" y1="50" x2="600" y2="50" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                        <line x1="0" y1="100" x2="600" y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                        <line x1="0" y1="150" x2="600" y2="150" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                        <path d={areaPath} fill="url(#enterpret-area)" />
                        <path d={linePath} fill="none" stroke="url(#enterpret-line)" strokeWidth="2.5" filter="url(#enterpret-glow)" strokeLinecap="round" strokeLinejoin="round" />
                        {points.map((p, i) => (
                          <circle key={i} cx={p.x.toFixed(2)} cy={p.y.toFixed(2)} r="2.5" fill="#0B1014" stroke="#38bdf8" strokeWidth="1.5" />
                        ))}
                        <motion.circle cx={points[points.length - 1].x.toFixed(2)} cy={points[points.length - 1].y.toFixed(2)} r="14" fill="#38bdf8" animate={{ scale: [1, 3, 1], opacity: [0.15, 0, 0.15] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }} />
                        <motion.circle cx={points[points.length - 1].x.toFixed(2)} cy={points[points.length - 1].y.toFixed(2)} r="5" fill="#38bdf8" animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
                        <line x1="600" y1="10" x2="600" y2="190" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 4" />
                      </svg>
                    </div>
                    <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                        <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Top Themes</span>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: "Billing & Payments", impact: 94, change: "+12%" },
                          { label: "Onboarding", impact: 87, change: "+8%" },
                          { label: "API Reliability", impact: 76, change: "+23%" },
                          { label: "Mobile Experience", impact: 65, change: "+5%" },
                        ].map((theme, i) => (
                          <div key={theme.label} className="group">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-slate-300 group-hover:text-white transition">{theme.label}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-emerald-400">{theme.change}</span>
                                <span className="text-[10px] font-semibold text-slate-400">{theme.impact}</span>
                              </div>
                            </div>
                            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${theme.impact}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.2, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                                className="h-full rounded-full bg-gradient-to-r from-sky-400 to-emerald-400"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="signals" className="relative py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-400">01 / Signals</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Ingest every signal</h2>
              <p className="mt-4 mx-auto max-w-2xl text-slate-400">Unify feedback from every channel — support tickets, sales calls, surveys, reviews, and social — into one structured stream that your teams and AI can act on.</p>
              <a href="#signals" className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-sky-400 hover:text-sky-300 transition">
                See it in action <ArrowRight className="h-3 w-3" />
              </a>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { 
                  icon: MessageSquare, 
                  label: "Tickets", 
                  desc: "Zendesk, Intercom, Freshdesk",
                  details: "Bidirectional sync keeps tickets and themes aligned. Tag, route, and prioritize support conversations automatically as new issues emerge."
                },
                { 
                  icon: Phone, 
                  label: "Calls", 
                  desc: "Gong, Chorus, call recordings",
                  details: "Transcribe and analyze sales and success calls in real time. Extract objections, feature requests, and renewal risks directly from conversation audio."
                },
                { 
                  icon: FileText, 
                  label: "Surveys", 
                  desc: "NPS, CSAT, custom surveys",
                  details: "Connect survey responses to customer records and product usage. Understand not just what customers say, but who is saying it and why."
                },
                { 
                  icon: BarChart3, 
                  label: "Product Usage", 
                  desc: "Mixpanel, Amplitude, PostHog",
                  details: "Link behavioral telemetry to qualitative feedback. See which drop-offs correlate with support tickets, churn signals, or feature confusion."
                },
                { 
                  icon: MessageCircle, 
                  label: "Social", 
                  desc: "Twitter, LinkedIn, Reddit",
                  details: "Monitor public conversations and community discussions. Surface emerging issues, viral complaints, and product demand before they hit support."
                },
                { 
                  icon: MessageSquare, 
                  label: "App Reviews", 
                  desc: "App Store, Google Play",
                  details: "Aggregate and classify app store feedback at scale. Track sentiment trends, identify top complaints, and measure review impact on downloads."
                },
              ].map((item, i) => (
                <ExpandableCard key={item.label} delay={i * 0.08} color="sky">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-sky-400">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-400">{item.details}</p>
                </ExpandableCard>
              ))}
            </div>
          </div>
        </section>

        <section id="intelligence" className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-violet-400">02 / Intelligence</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Turn noise into structure</h2>
              <p className="mt-4 mx-auto max-w-2xl text-slate-400">Apply adaptive taxonomy, sentiment analysis, and AI reasoning to transform raw feedback into themes, trends, and grounded explanations — automatically.</p>
              <a href="#intelligence" className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-violet-400 hover:text-violet-300 transition">
                See it in action <ArrowRight className="h-3 w-3" />
              </a>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { 
                  icon: Tag, 
                  label: "Theme & Taxonomy", 
                  desc: "Auto-cluster feedback into themes",
                  details: "Build a shared language for customer feedback that evolves with your product. Themes auto-suggest, merge, and split as your understanding deepens."
                },
                { 
                  icon: Heart, 
                  label: "Sentiment", 
                  desc: "Emotion detection per signal",
                  details: "Go beyond positive, negative, and neutral. Detect frustration, confusion, delight, and urgency at the sentence level across every channel."
                },
                { 
                  icon: Activity, 
                  label: "Trends", 
                  desc: "Temporal pattern analysis",
                  details: "Spot shifts in sentiment, volume, and theme distribution over time. Know exactly when an issue emerged, peaked, and resolved."
                },
                { 
                  icon: Sparkles, 
                  label: "AI Reasoning", 
                  desc: "Grounded explanations",
                  details: "Get natural-language answers backed by actual feedback records. Every insight cites its source so teams can verify, drill down, and act with confidence."
                },
              ].map((item, i) => (
                <ExpandableCard key={item.label} delay={i * 0.1} color="violet">
                  <div className="mb-4 rounded-xl border border-violet-400/20 bg-violet-400/10 p-2.5 text-violet-300 w-fit">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-white">{item.label}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.desc}</p>
                  <p className="mt-4 text-sm leading-6 text-slate-400">{item.details}</p>
                </ExpandableCard>
              ))}
            </div>
          </div>
        </section>

        <section id="context" className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-400">03 / Context</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Attach meaning</h2>
              <p className="mt-4 mx-auto max-w-2xl text-slate-400">Link every signal to customer segments, product features, lifecycle stages, and business outcomes so you always know who is talking and why it matters.</p>
              <a href="#context" className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-emerald-400 hover:text-emerald-300 transition">
                See it in action <ArrowRight className="h-3 w-3" />
              </a>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { 
                  icon: Users, 
                  label: "Segment", 
                  details: "Map feedback to ICP tiers, enterprise vs. SMB, new vs. power users, and custom segments. Understand which customer groups are driving which themes."
                },
                { 
                  icon: Package, 
                  label: "Feature", 
                  details: "Attach every signal to the exact module, capability, or UI surface it mentions. Know whether feedback is about onboarding, billing, API, or mobile."
                },
                { 
                  icon: GitBranch, 
                  label: "Lifecycle", 
                  details: "See how sentiment and issues shift from onboarding through renewal. Identify friction points by journey stage, not just by volume."
                },
                { 
                  icon: BarChart3, 
                  label: "Use Case", 
                  details: "Cluster feedback by job-to-be-done so product teams can prioritize based on actual use cases rather than the loudest single voice."
                },
                { 
                  icon: Zap, 
                  label: "Plan", 
                  details: "Connect feedback to pricing tier and plan type. Understand whether free, pro, or enterprise users are requesting different capabilities."
                },
              ].map((item, i) => (
                <ExpandableCard key={item.label} delay={i * 0.08} color="emerald">
                  <div className="mb-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-2 text-emerald-300 w-fit">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <p className="font-semibold text-white">{item.label}</p>
                  <p className="mt-4 text-sm leading-6 text-slate-400">{item.details}</p>
                </ExpandableCard>
              ))}
            </div>
          </div>
        </section>

        <section id="outcomes" className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-400">04 / Outcomes</p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Connect to revenue</h2>
              <p className="mt-4 mx-auto max-w-2xl text-slate-400">Track how customer feedback impacts adoption, churn, expansion, and win rates. Close the loop between insight and measurable business results.</p>
              <a href="#outcomes" className="inline-flex items-center gap-1.5 mt-4 text-xs font-medium text-amber-400 hover:text-amber-300 transition">
                See it in action <ArrowRight className="h-3 w-3" />
              </a>
            </motion.div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { 
                  icon: TrendingUp, 
                  label: "Adoption", 
                  change: "+18%",
                  details: "Connect feature usage data to customer feedback. See whether users who request a feature actually adopt it after launch, and measure time-to-value."
                },
                { 
                  icon: Zap, 
                  label: "Revenue", 
                  change: "+$2.4M",
                  details: "Weight themes by ARR impact so the dashboard shows what matters to the bottom line. Prioritize issues that threaten expansion over minor UI bugs."
                },
                { 
                  icon: GitBranch, 
                  label: "Roadmap", 
                  change: "12 prioritized",
                  details: "Generate evidence-based roadmaps from real customer signals. Every roadmap item is tied to feedback volume, sentiment, and business impact."
                },
                { 
                  icon: Activity, 
                  label: "Churn Risk", 
                  change: "-31%",
                  details: "Detect early warning signals before customers cancel. Correlate support interactions, NPS drops, and usage declines to identify at-risk accounts."
                },
                { 
                  icon: BarChart3, 
                  label: "Win Rate", 
                  change: "+8.2%",
                  details: "Track how product changes and feedback response affect deal outcomes. Connect customer requests to closed-won and closed-lost reasons in your CRM."
                },
              ].map((item, i) => (
                <ExpandableCard key={item.label} delay={i * 0.08} color="amber">
                  <div className="mb-3 rounded-xl border border-amber-400/20 bg-amber-400/10 p-2.5 text-amber-300 w-fit">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-white">{item.label}</p>
                  <p className="mt-1 text-sm text-emerald-400">{item.change}</p>
                  <p className="mt-4 text-sm leading-6 text-slate-400">{item.details}</p>
                </ExpandableCard>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Built for enterprise</h2>
              <p className="mt-4 text-slate-400">Multi-tenant architecture, retrieval-grounded answers, and metrics computed from stored facts — designed for teams that scale.</p>
            </motion.div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { 
                  title: "Multi-tenant Workspaces", 
                  desc: "Every query scoped by tenant boundary",
                  details: "Isolate customer data by organization, region, or business unit. Role-based access ensures teams only see the signals relevant to their domain."
                },
                { 
                  title: "Retrieval-Grounded Q&A", 
                  desc: "Answers cite specific feedback records",
                  details: "Ask natural-language questions and get answers backed by actual feedback. Every insight links to source records so teams can verify, drill down, and trust the result."
                },
                { 
                  title: "Numbers Before Narrative", 
                  desc: "Metrics computed from stored facts",
                  details: "All metrics are derived from structured feedback and context — not AI hallucinations. Know exactly how each number was calculated and what signals drove it."
                },
              ].map((item, i) => (
                <ExpandableCard key={item.title} delay={i * 0.1} color="sky">
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-400">{item.desc}</p>
                  <p className="mt-4 text-sm leading-6 text-slate-400">{item.details}</p>
                </ExpandableCard>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            >
              Ready to build the feedback layer your product team deserves?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-slate-400"
            >
              Start ingesting feedback, organizing themes, and querying grounded answers — in minutes.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <a href="/signup" className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-100">
                Start free
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <a href="/login" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur-xl transition hover:border-white/20 hover:bg-white/10">
                View demo
              </a>
            </motion.div>
          </div>
        </section>

        <footer className="border-t border-white/5 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]" />
                <span className="text-sm font-semibold text-white">LOOP</span>
              </div>
              <p className="text-sm text-slate-500">Customer Feedback Intelligence</p>
              <p className="text-xs text-slate-600">Built as a portfolio project</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
