"use client"

import { motion } from "framer-motion"

export default function GlassCard({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-500 hover:border-sky-400/40 hover:shadow-[0_0_40px_rgba(56,189,248,0.15)] ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-emerald-500/10 opacity-0 transition-opacity duration-500 hover:opacity-100" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
