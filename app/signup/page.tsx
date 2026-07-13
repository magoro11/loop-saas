"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [workspaceName, setWorkspaceName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, workspaceName }),
    })

    setLoading(false)

    if (!response.ok) {
      const payload = await response.json().catch(() => null)
      setError(payload?.error || "Unable to create account.")
      return
    }

    router.push("/login?signup=success")
  }

  return (
    <div className="mx-auto max-w-md py-16">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Create your workspace</h1>
        <p className="mt-2 text-sm text-slate-600">Start capturing and classifying customer feedback in minutes.</p>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="workspaceName" className="block text-sm font-medium text-slate-700">
              Workspace name
            </label>
            <input
              id="workspaceName"
              name="workspaceName"
              className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
              type="text"
              placeholder="Acme Inc"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700">
              Full name
            </label>
            <input
              id="name"
              name="name"
              className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
              type="text"
              placeholder="Jane Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              className="mt-1 block w-full rounded-xl border border-gray-300 px-3 py-2 text-sm shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-100"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <p className="mt-1 text-xs text-slate-500">Must be at least 8 characters.</p>
          </div>
        </div>

        {error ? (
          <p className="rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700" aria-live="polite">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating workspace..." : "Create workspace"}
        </button>

        <p className="text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-slate-900 underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  )
}
