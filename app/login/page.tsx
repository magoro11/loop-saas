"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    })
    if (result?.error) {
      setError("Invalid email or password.")
      return
    }
    router.push("/dashboard")
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Sign in to LOOP</h1>
        <p className="mt-2 text-sm text-slate-600">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-slate-900 underline underline-offset-4">
            Create workspace
          </Link>
        </p>
      </div>

      <form className="mt-8 space-y-6 rounded-3xl border border-white/10 bg-white/[0.06] p-8 shadow-2xl shadow-teal-950/30 backdrop-blur-xl" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            className="mt-1 block w-full rounded-xl border border-white/15 bg-[#0B1014]/80 px-3 py-3 text-sm text-white placeholder:text-slate-500 shadow-inner transition focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            className="mt-1 block w-full rounded-xl border border-white/15 bg-[#0B1014]/80 px-3 py-3 text-sm text-white placeholder:text-slate-500 shadow-inner transition focus:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          className="w-full rounded-full bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Sign in
        </button>
      </form>
    </div>
  )
}
