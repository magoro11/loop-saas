"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

export default function ExpandableCard({
  children,
  className = "",
  delay = 0,
  color = "sky",
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  color?: "sky" | "violet" | "emerald" | "amber"
}) {
  const [expanded, setExpanded] = useState(false)

  const colorClasses = {
    sky: "hover:border-sky-400/40 hover:shadow-[0_0_40px_rgba(56,189,248,0.15)]",
    violet: "hover:border-violet-400/40 hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]",
    emerald: "hover:border-emerald-400/40 hover:shadow-[0_0_40px_rgba(52,211,153,0.15)]",
    amber: "hover:border-amber-400/40 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]",
  }

  const gradientClasses = {
    sky: "from-sky-500/10 via-transparent to-emerald-500/10",
    violet: "from-violet-500/10 via-transparent to-purple-500/10",
    emerald: "from-emerald-500/10 via-transparent to-teal-500/10",
    amber: "from-amber-500/10 via-transparent to-orange-500/10",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-500 cursor-pointer ${colorClasses[color]} ${className}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[color]} opacity-0 transition-opacity duration-500 hover:opacity-100`} />
      <div className="relative z-10">
        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {children}
            </div>
            <div className={`rounded-full border border-white/10 bg-white/5 p-1.5 text-slate-400 transition-all duration-300 ${expanded ? "bg-white/10 text-white" : ""}`}>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </div>
          </div>
        </div>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 pt-2">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400 mb-2">How it works</p>
                  <p className="text-sm leading-6 text-slate-300">
                    LOOP continuously ingests signals from this channel, applies tenant-safe classification, and connects each piece of feedback to customer context, product features, and business outcomes — all in real time.
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-sky-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                    <span>Real-time sync</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 ml-2" />
                    <span>Auto-classification</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400 ml-2" />
                    <span>Context-aware</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
