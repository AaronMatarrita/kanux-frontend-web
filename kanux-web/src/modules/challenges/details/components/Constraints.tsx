interface ConstraintsProps {
  constraints: string[];
}

export function Constraints({ constraints }: ConstraintsProps) {
  if (!constraints || constraints.length === 0) {
    return null;
  }

  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-3">
        Restricciones
      </h2>
      <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
        {constraints.map((constraint: string, i: number) => (
          <li key={i}>{constraint}</li>
        ))}
      </ul>
    </section>
  );
}
