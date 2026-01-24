import Link from "next/link";
import { Code2, FlaskConical, Layers, Clock, ArrowRight } from "lucide-react";

interface ChallengeCardProps {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  duration: string;
}

const difficultyConfig = {
  easy: {
    label: "Beginner",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    icon: FlaskConical,
  },
  medium: {
    label: "Intermediate",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
    icon: Code2,
  },
  hard: {
    label: "Advanced",
    className: "bg-rose-50 text-rose-700 border border-rose-200",
    icon: Layers,
  },
};

export function ChallengeCard({
  id,
  title,
  description,
  difficulty,
  duration,
}: ChallengeCardProps) {
  const config = difficultyConfig[difficulty];
  const Icon = config.icon;

  return (
    <div className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-md">
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
          <Icon className="h-5 w-5" />
        </div>

        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
        >
          {config.label}
        </span>
      </div>

      {/* Content */}
      <h3 className="mt-4 text-base font-semibold text-slate-900 leading-snug">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-600 line-clamp-2">{description}</p>

      {/* Footer */}
      <div className="mt-auto pt-4">
        {/* Timer */}
        <div className="mb-3 flex items-center gap-2 text-sm text-slate-500">
          <Clock className="h-4 w-4" />
          {duration}
        </div>

        {/* CTA */}
        <Link
          href={`/talent/challenges/${id}/details`}
          className="flex w-full items-center justify-center rounded-md border border-slate-200 bg-[#2EC27E] px-3 py-2 text-xs font-medium text-white transition hover:bg-[#28b76a] focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
        >
          View details
        </Link>
      </div>
    </div>
  );
}
