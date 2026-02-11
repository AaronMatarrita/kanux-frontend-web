import { HelpCircle } from "lucide-react";

interface SoftChallengeDetailsProps {
  softData: any;
}

export function SoftChallengeDetails({ softData }: SoftChallengeDetailsProps) {
  const firstChallenge = softData?.non_technical_challenges?.[0];
  const questionCount = firstChallenge?.non_technical_questions?.length || 0;

  return (
    <section className="rounded-lg border border-border bg-card p-6 space-y-4">
      <h2 className="text-lg font-semibold text-foreground">
        Acerca del desafío
      </h2>

      {firstChallenge?.instructions && (
        <p className="text-sm text-muted-foreground">
          {firstChallenge.instructions}
        </p>
      )}

      <div className="rounded-md border border-border bg-muted/30 p-4">
        <div className="flex items-center gap-2 text-foreground">
          <HelpCircle className="h-5 w-5" />
          <p className="text-sm font-medium">
            Este desafío contiene{" "}
            <span className="font-bold text-foreground">{questionCount}</span>{" "}
            preguntas para evaluar tus habilidades blandas.
          </p>
        </div>
      </div>
    </section>
  );
}
