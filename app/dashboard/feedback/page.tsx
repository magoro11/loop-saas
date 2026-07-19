"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Theme {
  id: string
  name: string
}

interface FeedbackItem {
  id: string
  content: string
  channel: string
  status: string
  sentiment: string | null
  sentimentScore: number | null
  createdAt: string
  themes: { theme: { id: string; name: string } }[]
}

export default function FeedbackPage() {
  const router = useRouter()
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([])
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [limit] = useState(25)
  const [offset, setOffset] = useState(0)
  const [role, setRole] = useState<string>("VIEWER")

  const [q, setQ] = useState("")
  const [channel, setChannel] = useState("")
  const [status, setStatus] = useState("")
  const [sentiment, setSentiment] = useState("")
  const [themeId, setThemeId] = useState("")

  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setRole(parsed.role || "VIEWER")
      } catch {}
    }
  }, [])

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (q) params.set("q", q)
    if (channel) params.set("channel", channel)
    if (status) params.set("status", status)
    if (sentiment) params.set("sentiment", sentiment)
    if (themeId) params.set("themeId", themeId)
    params.set("limit", String(limit))
    params.set("offset", String(offset))

    const [feedbackRes, themesRes] = await Promise.all([
      fetch(`/api/feedback?${params.toString()}`),
      fetch("/api/themes"),
    ])

    const feedbackData = await feedbackRes.json()
    const themesData = await themesRes.json()

    setFeedbacks(feedbackData.feedbacks || [])
    setTotal(feedbackData.total || 0)
    setThemes(themesData.themes || [])
    setLoading(false)
  }, [q, channel, status, sentiment, themeId, limit, offset])

  useEffect(() => {
    fetchFeedbacks()
  }, [fetchFeedbacks])

  async function handleStatusChange(feedbackId: string, newStatus: string) {
    setUpdatingStatus(feedbackId)
    await fetch(`/api/feedback/${feedbackId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    setUpdatingStatus(null)
    fetchFeedbacks()
  }

  async function handleClassify(feedbackId: string) {
    await fetch(`/api/feedback/${feedbackId}/classify`, { method: "POST" })
    fetchFeedbacks()
  }

  async function handleSeed() {
    await fetch("/api/feedback/seed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ count: 20 }),
    })
    fetchFeedbacks()
  }

  function clearFilters() {
    setQ("")
    setChannel("")
    setStatus("")
    setSentiment("")
    setThemeId("")
    setOffset(0)
  }

  const canEdit = role === "ADMIN" || role === "ANALYST"

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Feedback inbox</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-slate-900">All feedback</h1>
            <p className="mt-4 max-w-2xl text-slate-600">Search, filter, and triage customer feedback. Use inline status to move items through the workflow.</p>
          </div>
          <div className="flex gap-3">
            {canEdit && (
              <button
                onClick={handleSeed}
                className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Seed demo data
              </button>
            )}
            <Link href="/dashboard/feedback/new" className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
              Add feedback
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-slate-700">Search</label>
            <input
              type="text"
              value={q}
              onChange={(e) => { setQ(e.target.value); setOffset(0) }}
              placeholder="Search feedback content..."
              className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Channel</label>
            <select
              value={channel}
              onChange={(e) => { setChannel(e.target.value); setOffset(0) }}
              className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
            >
              <option value="">All</option>
              <option value="EMAIL">Email</option>
              <option value="WEB">Web</option>
              <option value="APPSTORE">App Store</option>
              <option value="NPS">NPS</option>
              <option value="SOCIAL">Social</option>
              <option value="CALL">Call</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Sentiment</label>
            <select
              value={sentiment}
              onChange={(e) => { setSentiment(e.target.value); setOffset(0) }}
              className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
            >
              <option value="">All</option>
              <option value="POSITIVE">Positive</option>
              <option value="NEUTRAL">Neutral</option>
              <option value="NEGATIVE">Negative</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); setOffset(0) }}
              className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
            >
              <option value="">All</option>
              <option value="NEW">New</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="ACTIONED">Actioned</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Theme</label>
            <select
              value={themeId}
              onChange={(e) => { setThemeId(e.target.value); setOffset(0) }}
              className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
            >
              <option value="">All</option>
              {themes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>
        {(q || channel || status || sentiment || themeId) && (
          <button onClick={clearFilters} className="mt-3 text-sm font-semibold text-slate-900 underline">
            Clear filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-slate-500">Loading...</p>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm text-center">
          <p className="text-slate-500">No feedback found. Try adjusting your filters or add new feedback.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((item) => (
            <div key={item.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-700">
                      {item.channel}
                    </span>
                    {item.sentiment && (
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                        item.sentiment === "POSITIVE" ? "bg-green-100 text-green-700" :
                        item.sentiment === "NEGATIVE" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {item.sentiment}
                      </span>
                    )}
                    {item.themes.length > 0 && (
                      <span className="text-xs text-slate-500">
                        {item.themes.map((t) => t.theme.name).join(", ")}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm text-slate-700">{item.content}</p>
                  <p className="mt-1 text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {canEdit ? (
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      disabled={updatingStatus === item.id}
                      className="rounded-lg border border-gray-300 px-2 py-1 text-xs font-medium uppercase tracking-wider text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="NEW">NEW</option>
                      <option value="REVIEWED">REVIEWED</option>
                      <option value="ACTIONED">ACTIONED</option>
                    </select>
                  ) : (
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${
                      item.status === "NEW" ? "bg-blue-100 text-blue-700" :
                      item.status === "REVIEWED" ? "bg-yellow-100 text-yellow-700" :
                      "bg-green-100 text-green-700"
                    }`}>
                      {item.status}
                    </span>
                  )}
                  {canEdit && (
                    <button
                      onClick={() => handleClassify(item.id)}
                      className="text-xs font-medium text-slate-500 underline hover:text-slate-900"
                    >
                      Re-classify
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
          <button
            onClick={() => setOffset(Math.max(0, offset - limit))}
            disabled={offset === 0}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Previous
          </button>
          <span className="text-sm text-slate-500">
            Page {Math.floor(offset / limit) + 1} of {totalPages} ({total} total)
          </span>
          <button
            onClick={() => setOffset(offset + limit)}
            disabled={offset + limit >= total}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
