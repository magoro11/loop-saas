import { getServerSession } from "next-auth/next"
import { authOptions } from "../../lib/nextauth"

export default async function ProtectedPage({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg">You must sign in to continue.</p>
        <a href="/login" className="mt-4 inline-block rounded-full bg-slate-900 px-6 py-3 text-white">
          Sign in
        </a>
      </div>
    )
  }

  return <>{children}</>
}
