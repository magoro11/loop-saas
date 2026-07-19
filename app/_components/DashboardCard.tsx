"use client"

import { motion } from "framer-motion"
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react"

export default function DashboardCard({
  title,
  value,
  change,
  icon: Icon,
  delay = 0,
}: {
  title: string
  value: string | number
  change?: string
  icon: LucideIcon
  delay?: number
}) {
  const trend =
    change && change.startsWith("+")
      ? "up"
      : change && change.startsWith("-")
        ? "down"
        : "neutral"

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl transition-all duration-500 hover:border-sky-400/40 hover:shadow-[0_0_50px_rgba(56,189,248,0.12)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/8 via-transparent to-emerald-500/8 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-slate-400">{title}</p>
          <p className="mt-3 text-4xl font-semibold tracking-tight text-white">{value}</p>
          {change && (
            <div className="mt-2 flex items-center gap-1.5 text-sm">
              {trend === "up" && <TrendingUp className="h-4 w-4 text-emerald-400" />}
              {trend === "down" && <TrendingDown className="h-4 w-4 text-rose-400" />}
              {trend === "neutral" && <Minus className="h-4 w-4 text-slate-400" />}
              <span
                className={
                  trend === "up"
                    ? "text-emerald-400"
                    : trend === "down"
                      ? "text-rose-400"
                      : "text-slate-400"
                }
              >
                {change}
              </span>
              <span className="text-slate-500">vs last period</span>
            </div>
          )}
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.15)]">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  )
}
