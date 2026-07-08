import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-20">
      <div className="mx-auto max-w-5xl rounded-[32px] bg-white p-10 shadow-xl shadow-slate-200/50">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">LOOP</p>
            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-900">
              Turn customer feedback into prioritized, evidence-backed action.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              LOOP centralizes customer feedback across channels, applies tenant-safe classification and theme analysis, and surfaces what to do next.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800">
                Sign in
              </Link>
              <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-slate-900 hover:bg-slate-50">
                View dashboard
              </Link>
            </div>
          </div>
          <div className="rounded-[32px] bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/20">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Demo workspace</p>
            <div className="mt-8 space-y-4 text-sm">
              <div className="rounded-3xl bg-slate-900/80 p-4">
                <p className="font-semibold">Admin login</p>
                <p>admin@demo.com</p>
                <p>Admin123!</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-4">
                <p className="font-semibold">Analyst login</p>
                <p>analyst@demo.com</p>
                <p>Admin123!</p>
              </div>
              <div className="rounded-3xl bg-slate-900/80 p-4">
                <p className="font-semibold">Viewer login</p>
                <p>viewer@demo.com</p>
                <p>Admin123!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
