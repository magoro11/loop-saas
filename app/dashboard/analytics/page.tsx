"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts"

const COLORS = ["#0f172a", "#334155", "#64748b", "#94a3b8", "#cbd5e1", "#e2e8f0"]

interface StatCard {
  label: string
  value: number
}

interface VolumeData {
  day: string
  count: number
}

interface SentimentData {
  name: string
  value: number
}

interface ThemeData {
  name: string
  count: number
}

interface ChannelData {
  name: string
  value: number
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<StatCard[]>([])
  const [volumeData, setVolumeData] = useState<VolumeData[]>([])
  const [sentimentData, setSentimentData] = useState<SentimentData[]>([])
  const [topThemes, setTopThemes] = useState<ThemeData[]>([])
  const [channelData, setChannelData] = useState<ChannelData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [feedbackRes, themesRes] = await Promise.all([
        fetch("/api/feedback?limit=500"),
        fetch("/api/themes"),
      ])

      const feedbackData = await feedbackRes.json()
      const themesData = await themesRes.json()

      const feedbacks = feedbackData.feedbacks || []
      const themes = themesData.themes || []

      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      const totalFeedback = feedbacks.length
      const negativeCount = feedbacks.filter((f: any) => f.sentiment === "NEGATIVE").length
      const newThisWeek = feedbacks.filter((f: any) => new Date(f.createdAt) >= sevenDaysAgo).length
      const themeCount = themes.length

      const dayMap = new Map<string, number>()
      for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        const key = d.toISOString().slice(5, 10)
        dayMap.set(key, 0)
      }
      for (const f of feedbacks) {
        if (new Date(f.createdAt) >= thirtyDaysAgo) {
          const key = new Date(f.createdAt).toISOString().slice(5, 10)
          dayMap.set(key, (dayMap.get(key) || 0) + 1)
        }
      }
      const volume = Array.from(dayMap.entries()).map(([day, count]) => ({ day, count }))

      const sentimentMap = new Map<string, number>()
      for (const f of feedbacks) {
        const key = f.sentiment || "Unlabeled"
        sentimentMap.set(key, (sentimentMap.get(key) || 0) + 1)
      }
      const sentiment = Array.from(sentimentMap.entries()).map(([name, value]) => ({ name, value }))

      const themeCounts = themes
        .map((t: any) => ({ name: t.name, count: t._count?.feedbacks || t.feedbacks?.length || 0 }))
        .sort((a: ThemeData, b: ThemeData) => b.count - a.count)
        .slice(0, 8)

      const channelMap = new Map<string, number>()
      for (const f of feedbacks) {
        channelMap.set(f.channel, (channelMap.get(f.channel) || 0) + 1)
      }
      const channel = Array.from(channelMap.entries()).map(([name, value]) => ({ name, value }))

      setStats([
        { label: "Total feedback", value: totalFeedback },
        { label: "Negative %", value: totalFeedback > 0 ? Math.round((negativeCount / totalFeedback) * 100) : 0 },
        { label: "New this week", value: newThisWeek },
        { label: "Themes", value: themeCount },
      ])
      setVolumeData(volume)
      setSentimentData(sentiment)
      setTopThemes(themeCounts)
      setChannelData(channel)
      setLoading(false)
    }

    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-slate-500">Loading analytics...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Analytics</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.02em] text-slate-900">Workspace insights</h1>
            <p className="mt-4 max-w-2xl text-slate-600">Track feedback volume, sentiment trends, and theme distribution.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">{s.label}</p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Volume over time (last 30 days)</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: "1rem", border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Line type="monotone" dataKey="count" stroke="#0f172a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Sentiment breakdown</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value" data={sentimentData}>
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "1rem", border: "1px solid #e2e8f0", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {sentimentData.map((entry, index) => (
                <span key={entry.name} className="flex items-center gap-1 text-xs text-slate-600">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {entry.name} ({entry.value})
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Top themes</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topThemes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: "1rem", border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="count" fill="#0f172a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">By channel</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" width={80} />
                <Tooltip contentStyle={{ borderRadius: "1rem", border: "1px solid #e2e8f0", fontSize: 12 }} />
                <Bar dataKey="value" fill="#334155" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Channel mix</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie cx="50%" cy="50%" outerRadius={80} dataKey="value" data={channelData}>
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "1rem", border: "1px solid #e2e8f0", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              {channelData.map((entry, index) => (
                <span key={entry.name} className="flex items-center gap-1 text-xs text-slate-600">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {entry.name} ({entry.value})
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
