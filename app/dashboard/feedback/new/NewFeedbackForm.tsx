"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const channels = ["WEB", "EMAIL", "APPSTORE", "NPS", "SOCIAL", "CALL"] as const

type Channel = (typeof channels)[number]

export default function NewFeedbackForm() {
  const [content, setContent] = useState("")
  const [channel, setChannel] = useState<Channel>("WEB")
  const [sourceRef, setSourceRef] = useState("")
  const [customerLabel, setCustomerLabel] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const trimmedContent = content.trim()
  const canSubmit = trimmedContent.length > 0 && !loading

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    if (!trimmedContent) {
      setError("Please enter some feedback before saving.")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmedContent, channel, sourceRef: sourceRef || undefined, customerLabel: customerLabel || undefined }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        setError(payload?.error?.message || payload?.error || "Unable to create feedback.")
        setLoading(false)
        return
      }

      const result = await response.json()

      if (result.id) {
        fetch(`/api/feedback/${result.id}/classify`, { method: "POST" }).catch(() => {})
      }

      router.push("/dashboard/feedback")
    } catch {
      setError("Something went wrong.")
      setLoading(false)
    }
  }

  return (
    <form className="space-y-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm" onSubmit={handleSubmit}>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Feedback</label>
            <p className="text-sm text-slate-500">Describe the issue or feature request in a few sentences.</p>
          </div>
          <p className="text-sm text-slate-500">{content.length} characters</p>
        </div>
        <textarea
          className="min-h-[180px] w-full rounded-3xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-100"
          rows={7}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Enter the customer feedback text here..."
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <label className="block text-sm font-medium text-slate-700">Channel</label>
          <p className="text-sm text-slate-500">Choose one source</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {channels.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setChannel(option)}
              className={`rounded-2xl border px-4 py-3 text-sm font-medium transition focus:outline-none ${
                channel === option
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700">Source reference (optional)</label>
          <input
            type="text"
            value={sourceRef}
            onChange={(e) => setSourceRef(e.target.value)}
            placeholder="e.g. ticket-123"
            className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Customer label (optional)</label>
          <input
            type="text"
            value={customerLabel}
            onChange={(e) => setCustomerLabel(e.target.value)}
            placeholder="e.g. Enterprise Plan"
            className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
          />
        </div>
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700" aria-live="polite">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={!canSubmit}
        className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 hover:bg-slate-800"
      >
        {loading ? "Saving..." : "Save feedback"}
      </button>
    </form>
  )
}
