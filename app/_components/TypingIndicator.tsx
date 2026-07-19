"use client"

import { motion } from "framer-motion"

export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1, 0.85] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
            className="h-2 w-2 rounded-full bg-sky-400"
          />
        ))}
      </div>
      <span className="text-xs text-slate-400">AI is analyzing signals...</span>
    </div>
  )
}
