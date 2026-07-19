"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Report {
  id: string
  title: string
  periodStart: string
  periodEnd: string
  contentJson: string
  createdAt: string
  generatedBy: { name: string | null; email: string } | null
}

export default function ReportsPage() {
  const router = useRouter()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [periodStart, setPeriodStart] = useState("")
  const [periodEnd, setPeriodEnd] = useState("")
  const [generateAI, setGenerateAI] = useState(true)

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then((data) => {
        setReports(data.reports || [])
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load reports.")
        setLoading(false)
      })
  }, [])

  async function handleCreateReport(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    setCreating(true)

    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || `Signal report ${new Date().toLocaleDateString()}`,
          periodStart: periodStart || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          periodEnd: periodEnd || new Date().toISOString(),
          generateAI,
        }),
      })

      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        setError(payload?.error || "Failed to create report.")
        setCreating(false)
        return
      }

      const report = await res.json()
      setReports([report, ...reports])
      setTitle("")
      setPeriodStart("")
      setPeriodEnd("")
      router.refresh()
    } catch {
      setError("Failed to create report.")
    } finally {
      setCreating(false)
    }
  }

  function getContentJson(report: Report) {
    try {
      return JSON.parse(report.contentJson)
    } catch {
      return {}
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-slate-500">Loading reports...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Analyst reports</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-slate-900">Decision-ready summaries</h1>
            <p className="mt-4 max-w-2xl text-slate-600">Generate AI-powered Voice of Customer reports from your workspace data.</p>
          </div>
          <Link href="/dashboard/feedback" className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Go to feedback inbox
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <form onSubmit={handleCreateReport} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Generate report</h2>
            <p className="mt-1 text-sm text-slate-500">Create a structured snapshot of your workspace feedback.</p>

            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                  Report title
                </label>
                <input
                  id="title"
                  className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
                  type="text"
                  placeholder="Weekly signal report"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="periodStart" className="block text-sm font-medium text-slate-700">
                    From
                  </label>
                  <input
                    id="periodStart"
                    type="date"
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="periodEnd" className="block text-sm font-medium text-slate-700">
                    To
                  </label>
                  <input
                    id="periodEnd"
                    type="date"
                    className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="generateAI"
                  type="checkbox"
                  checked={generateAI}
                  onChange={(e) => setGenerateAI(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900"
                />
                <label htmlFor="generateAI" className="text-sm text-slate-700">
                  Generate AI narrative
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={creating}
              className="mt-4 w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {creating ? "Generating..." : "Generate report"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          {reports.length === 0 ? (
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Ready to create your first report?</h2>
              <p className="mt-2 text-sm text-slate-500">Start by collecting feedback in the inbox, then build a clear view of the themes worth acting on.</p>
              <Link href="/dashboard/feedback" className="mt-4 inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                Go to feedback inbox
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => {
                const content = getContentJson(report)
                return (
                  <div key={report.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{report.title}</h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {new Date(report.periodStart).toLocaleDateString()} — {new Date(report.periodEnd).toLocaleDateString()}
                        </p>
                        {report.generatedBy && (
                          <p className="mt-1 text-xs text-slate-400">By {report.generatedBy.name || report.generatedBy.email}</p>
                        )}
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Total feedback</p>
                        <p className="mt-2 text-2xl font-semibold text-slate-900">
                          {content.totalFeedback || 0}
                        </p>
                      </div>
                      <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Top themes</p>
                        <div className="mt-2 space-y-1">
                          {(content.topThemes as any[])?.slice(0, 3).map((t: any) => (
                            <div key={t.name} className="flex items-center justify-between text-sm">
                              <span className="text-slate-700">{t.name}</span>
                              <span className="text-slate-500">{t.count}</span>
                            </div>
                          )) || <p className="text-sm text-slate-400">No themes yet</p>}
                        </div>
                      </div>
                    </div>

                    {content.narrative && (
                      <div className="mt-4 rounded-xl border border-slate-100 bg-white p-4">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Narrative</p>
                        <p className="mt-2 text-sm leading-7 text-slate-700 whitespace-pre-wrap">{content.narrative}</p>
                      </div>
                    )}

                    {(content.recentFeedback as any[])?.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Recent signals</p>
                        <div className="mt-2 space-y-2">
                          {(content.recentFeedback as any[]).slice(0, 3).map((f: any) => (
                            <div key={f.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                              <p className="text-sm text-slate-700 line-clamp-2">{f.content}</p>
                              <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                                <span>{f.channel}</span>
                                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] uppercase tracking-wider">{f.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
