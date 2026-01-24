import { MarkdownRenderer } from "./MarkdownRenderer";

interface ChallengeDescriptionProps {
  description: string;
}

export function ChallengeDescription({
  description,
}: ChallengeDescriptionProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Descripción</h2>
      {description ? (
        <MarkdownRenderer content={description} />
      ) : (
        <p className="text-slate-500">Sin descripción disponible.</p>
      )}
    </section>
  );
}
