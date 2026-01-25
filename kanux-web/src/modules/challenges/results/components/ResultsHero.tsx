import { CheckCircle2, XCircle, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResultsHeroProps {
  isPassed: boolean;
  scorePercentage: number;
  challengeTitle?: string;
}

export function ResultsHero({
  isPassed,
  scorePercentage,
  challengeTitle,
}: ResultsHeroProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        isPassed
          ? "bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-600"
          : "bg-linear-to-br from-rose-500 via-rose-600 to-orange-500",
      )}
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white blur-3xl" />
      </div>

      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="mb-6 inline-flex">
            <div
              className={cn(
                "flex h-20 w-20 items-center justify-center rounded-full",
                "bg-white/20 backdrop-blur-sm ring-4 ring-white/30",
              )}
            >
              {isPassed ? (
                <CheckCircle2 className="h-10 w-10 text-white" />
              ) : (
                <XCircle className="h-10 w-10 text-white" />
              )}
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight text-balance">
            {isPassed ? "¡Felicitaciones!" : "Sigue Intentando"}
          </h1>

          <p className="text-lg md:text-xl opacity-90 font-medium mb-6">
            {challengeTitle || "Technical Challenge"}
          </p>

          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 ring-1 ring-white/30">
            <Trophy className="h-5 w-5" />
            <span className="text-2xl font-bold">{scorePercentage}</span>
            <span className="text-sm opacity-80">/ 100 puntos</span>
          </div>
        </div>
      </div>
    </div>
  );
}
