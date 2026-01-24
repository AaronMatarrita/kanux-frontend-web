import { HelpCircle } from "lucide-react";

interface SoftChallengeDetailsProps {
  softData: any;
}

export function SoftChallengeDetails({ softData }: SoftChallengeDetailsProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">
        Acerca del challenge
      </h2>

      {softData?.non_technical_challenges?.[0]?.instructions && (
        <p className="text-sm text-slate-600">
          {softData.non_technical_challenges[0].instructions}
        </p>
      )}

      <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-slate-700">
          <HelpCircle className="h-5 w-5" />
          <p className="text-sm font-medium">
            Este challenge contiene{" "}
            <span className="font-bold text-slate-900">
              {softData?.non_technical_challenges?.[0]?.non_technical_questions
                ?.length || 0}
            </span>{" "}
            preguntas para evaluar tus soft skills.
          </p>
        </div>
      </div>
    </section>
  );
}
