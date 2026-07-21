"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Theme {
  id: string
  name: string
  description: string | null
  color: string | null
  createdAt: string
  feedbacks: { feedback: { id: string; content: string; channel: string } }[]
}

interface Feedback {
  id: string
  content: string
  channel: string
  status: string
  createdAt: string
}

export default function ThemesPage() {
  const router = useRouter()
  const [themes, setThemes] = useState<Theme[]>([])
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedFeedback, setSelectedFeedback] = useState<string>("")
  const [assigning, setAssigning] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      fetch("/api/themes").then((r) => r.json()),
      fetch("/api/feedback?limit=50").then((r) => r.json()),
    ])
      .then(([themesData, feedbackData]) => {
        setThemes(themesData.themes || [])
        setFeedbacks(feedbackData.feedbacks || [])
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load themes and feedback.")
        setLoading(false)
      })
  }, [])

  async function handleCreateTheme(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setCreating(true)

    const response = await fetch("/api/themes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    })

    setCreating(false)

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      setError(payload?.error || "Failed to create theme.")
      return
    }

    const theme = await response.json()
    setThemes([theme, ...themes])
    setName("")
    setDescription("")
    router.refresh()
  }

  async function handleAssignTheme(themeId: string, feedbackId: string) {
    setAssigning(feedbackId)
    const response = await fetch(`/api/themes/${themeId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedbackId }),
    })

    setAssigning(null)

    if (!response.ok) {
      setError("Failed to assign theme.")
      return
    }

    setThemes(
      themes.map((t) =>
        t.id === themeId
          ? {
              ...t,
              feedbacks: [
                ...t.feedbacks,
                { feedback: feedbacks.find((f) => f.id === feedbackId)! },
              ],
            }
          : t
      )
    )
    router.refresh()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-slate-500">Loading themes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Theme analysis</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-slate-900">Prioritized themes</h1>
            <p className="mt-4 max-w-2xl text-slate-600">Group related feedback into durable themes and rank them by likely business impact.</p>
          </div>
          <Link href="/dashboard/feedback" className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Review feedback
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <form onSubmit={handleCreateTheme} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Create theme</h2>
            <p className="mt-1 text-sm text-slate-500">Name a recurring signal and describe why it matters.</p>

            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Theme name
                </label>
                <input
                  id="name"
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
                  type="text"
                  placeholder="e.g. Billing friction"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  id="description"
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
                  rows={3}
                  placeholder="Why this theme matters..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="mt-4 w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? "Creating..." : "Create theme"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          {themes.length === 0 ? (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">No themes yet</h2>
              <p className="mt-2 text-sm text-slate-500">Create themes from the feedback inbox to start grouping similar requests and surfacing priorities.</p>
              <Link href="/dashboard/feedback" className="mt-4 inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                Review feedback
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {themes.map((theme) => (
                <div key={theme.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        {theme.color && (
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: theme.color }} />
                        )}
                        <h3 className="text-lg font-semibold text-slate-900">{theme.name}</h3>
                      </div>
                      {theme.description && (
                        <p className="mt-1 text-sm text-slate-600">{theme.description}</p>
                      )}
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">
                        {theme.feedbacks.length} feedback item{theme.feedbacks.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  {theme.feedbacks.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {theme.feedbacks.slice(0, 5).map((tf) => (
                        <div key={tf.feedback.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                          <p className="text-sm text-slate-700 line-clamp-2">{tf.feedback.content}</p>
                          <p className="mt-1 text-xs text-slate-400">{tf.feedback.channel}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4">
                    <label className="block text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                      Assign feedback
                    </label>
                    <select
                      className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
                      value=""
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAssignTheme(theme.id, e.target.value)
                          e.target.value = ""
                        }
                      }}
                    >
                      <option value="">Select feedback to assign...</option>
                      {feedbacks
                        .filter((f) => !theme.feedbacks.some((tf) => tf.feedback.id === f.id))
                        .map((f) => (
                          <option key={f.id} value={f.id}>
                            {f.content.slice(0, 60)}...
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
