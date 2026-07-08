import './globals.css'
import React from 'react'
import type { Session } from "next-auth"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../lib/nextauth"
import Link from "next/link"
import SignOutButton from "./_components/SignOutButton"

export const metadata = {
  title: 'LOOP — Customer Feedback Intelligence',
  description: 'LOOP placeholder app'
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions) as Session | null

  return (
    <html lang="en">
      <body>
        <header className="bg-white shadow-sm">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
            <div>
              <Link href="/" className="text-xl font-semibold text-slate-900">
                LOOP
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="text-sm font-medium text-slate-700 transition hover:text-slate-900">
                Dashboard
              </Link>
              {session?.user ? (
                <div className="flex items-center gap-3">
                  <p className="text-sm text-slate-600">{session.user.email}</p>
                  <SignOutButton />
                </div>
              ) : (
                <Link href="/login" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-10 sm:px-6">{children}</main>
      </body>
    </html>
  )
}
