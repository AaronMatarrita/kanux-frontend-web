import { MarkdownRenderer } from "./MarkdownRenderer";

interface ChallengeDescriptionProps {
  description: string;
}

export function ChallengeDescription({
  description,
}: ChallengeDescriptionProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Descripción
      </h2>
      {description ? (
        <MarkdownRenderer content={description} />
      ) : (
        <p className="text-muted-foreground">Sin descripción disponible.</p>
      )}
    </section>
  );
}
