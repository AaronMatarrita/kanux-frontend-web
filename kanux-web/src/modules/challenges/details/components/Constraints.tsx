interface ConstraintsProps {
  constraints: string[];
}

export function Constraints({ constraints }: ConstraintsProps) {
  if (!constraints || constraints.length === 0) {
    return null;
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-3">
        Restricciones
      </h2>
      <ul className="list-disc pl-5 text-sm text-slate-700 space-y-2">
        {constraints.map((constraint: string, i: number) => (
          <li key={i}>{constraint}</li>
        ))}
      </ul>
    </section>
  );
}
