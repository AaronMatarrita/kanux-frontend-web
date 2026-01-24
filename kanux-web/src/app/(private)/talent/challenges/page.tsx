import Link from "next/link";

export default function Page() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Talent · Challenges</h1>
      <p className="text-slate-600">Placeholder content</p>
      <div>
        <Link
          href="/talent/challenges/550e8400-e29b-41d4-a716-446655440005/execute"
          className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Ir a ejecución (mock)
        </Link>
      </div>
    </div>
  );
}
