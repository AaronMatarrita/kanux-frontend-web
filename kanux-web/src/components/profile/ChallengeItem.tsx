import { Trophy } from "lucide-react";

export function ChallengeItem({
  title,
  timeAgo,
  difficulty,
  score,
}: {
  title: string;
  timeAgo: string;
  difficulty: string;
  score: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 py-5 border-b border-border last:border-b-0 pl-2 pr-2">
      {/* Trophy Icon */}
      <div className="shrink-0">
        <div className="w-12 h-12 rounded-lg bg-muted/40 border border-border flex items-center justify-center">
          <Trophy className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>

      {/* Challenge Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-semibold text-foreground">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1">{timeAgo}</p>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-3 shrink-0">
        <span className="px-4 py-1.5 rounded-md text-sm font-medium bg-muted text-muted-foreground border border-border">
          {difficulty}
        </span>
        <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-foreground text-background min-w-15 text-center">
          {score} pt
        </span>
      </div>
    </div>
  );
}
