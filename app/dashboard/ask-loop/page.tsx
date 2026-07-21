"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"

interface Citation {
  id: string
  content: string
  score: number
}

export default function AskLoopPage() {
  const router = useRouter()
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState<string | null>(null)
  const [citations, setCitations] = useState<Citation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [history, setHistory] = useState<{ question: string; answer: string }[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [answer, history])

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim()) return
    setLoading(true)
    setError(null)
    setAnswer(null)

    try {
      const res = await fetch("/api/ask-loop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      })

      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        throw new Error(payload?.error || "Failed to get answer")
      }

      const data = await res.json()
      setAnswer(data.answer)
      setCitations(data.citations || [])
      setHistory((prev) => [...prev, { question, answer: data.answer }])
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    } finally {
      setLoading(false)
      setQuestion("")
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Ask LOOP</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-slate-900">Grounded Q&A</h1>
            <p className="mt-4 max-w-2xl text-slate-600">Ask questions about your feedback data and get answers backed by real customer messages.</p>
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleAsk} className="flex gap-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g., What are users saying about onboarding?"
            className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Thinking..." : "Ask"}
          </button>
        </form>
        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
      </div>

      {history.length > 0 && (
        <div className="space-y-6">
          {history.map((item, i) => (
            <div key={i} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Q: {item.question}</p>
              <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{item.answer}</p>
            </div>
          ))}
        </div>
      )}

      {answer && (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Answer</p>
          <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{answer}</p>

          {citations.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Citations</p>
              <div className="mt-3 space-y-2">
                {citations.map((c) => (
                  <div key={c.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <p className="text-sm text-slate-700 line-clamp-2">{c.content}</p>
                    <p className="mt-1 text-xs text-slate-400">Relevance: {(c.score * 100).toFixed(0)}%</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  )
}
