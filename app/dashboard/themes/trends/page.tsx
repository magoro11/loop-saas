"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface Trend {
  themeId: string
  name: string
  current: number
  previous: number
  change: number
  isSpiking: boolean
}

export default function ThemeTrendsPage() {
  const [trends, setTrends] = useState<Trend[]>([])
  const [loading, setLoading] = useState(true)
  const [periodDays, setPeriodDays] = useState(30)
  const [previousDays, setPreviousDays] = useState(30)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set("periodDays", String(periodDays))
    params.set("previousPeriodDays", String(previousDays))

    fetch(`/api/themes/trends?${params.toString()}`)
      .then((r) => r.json())
      .then((data) => {
        setTrends(data.trends || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [periodDays, previousDays])

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Theme trends</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-slate-900">Growing themes</h1>
            <p className="mt-4 max-w-2xl text-slate-600">See which themes are spiking versus the previous period.</p>
          </div>
          <div className="flex gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">Current period (days)</label>
              <input
                type="number"
                value={periodDays}
                onChange={(e) => setPeriodDays(Number(e.target.value))}
                className="mt-1 block w-24 rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Previous period (days)</label>
              <input
                type="number"
                value={previousDays}
                onChange={(e) => setPreviousDays(Number(e.target.value))}
                className="mt-1 block w-24 rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-slate-500">Loading trends...</p>
        </div>
      ) : trends.length === 0 ? (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-8 shadow-sm text-center">
          <p className="text-slate-500">No theme data yet. Create themes and add feedback to see trends.</p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Theme volume comparison</p>
            <div className="mt-4 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{ borderRadius: "1rem", border: "1px solid #e2e8f0", fontSize: 12 }}
                  />
                  <Bar dataKey="current" fill="#0f172a" radius={[4, 4, 0, 0]} name="Current period" />
                  <Bar dataKey="previous" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Previous period" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2">
            {trends.map((trend) => (
              <div
                key={trend.themeId}
                className={`rounded-[1.75rem] border p-6 shadow-sm ${
                  trend.isSpiking ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{trend.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">
                      {trend.current} items this period vs {trend.previous} last period
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                      trend.isSpiking
                        ? "bg-red-100 text-red-700"
                        : trend.change > 0
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {trend.change === Infinity ? "New" : `${trend.change > 0 ? "+" : ""}${trend.change.toFixed(0)}%`}
                  </span>
                </div>
                {trend.isSpiking && (
                  <p className="mt-2 text-sm text-red-700">This theme is spiking - consider reviewing the latest feedback.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
