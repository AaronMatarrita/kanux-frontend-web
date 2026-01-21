import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <main className="w-full max-w-xl rounded-2xl bg-white p-10 shadow-sm">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Kanux Web App
          </h1>
          <p className="mt-3 text-slate-600">
            Entry point temporal para desarrollo del layout privado.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <Link
            href="/talent/dashboard"
            className="flex h-12 items-center justify-center rounded-xl bg-[#0B2A4A] text-white font-medium transition-colors hover:bg-[#0B2A4A]/90"
          >
            Entrar como Talent
          </Link>

          <Link
            href="/company/dashboard"
            className="flex h-12 items-center justify-center rounded-xl border border-[#0B2A4A] text-[#0B2A4A] font-medium transition-colors hover:bg-[#0B2A4A]/10"
          >
            Entrar como Company
          </Link>
        </div>

        {/* Footer note */}
        <p className="mt-10 text-center text-xs text-slate-400">
          Este acceso será protegido por autenticación en fases posteriores.
        </p>
      </main>
    </div>
  );
}
