import { Trophy } from "lucide-react";

export function ChallengeItem({ 
  title, 
  timeAgo, 
  difficulty, 
  percentage 
}: { 
  title: string; 
  timeAgo: string; 
  difficulty: string; 
  percentage: number 
}) {
  return (
    <div className="flex flex-wrap items-center gap-4 py-5 border-b border-gray-200 last:border-b-0 pl-2 pr-2">
      {/* Trophy Icon */}
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
          <Trophy className="w-6 h-6 text-gray-700" />
        </div>
      </div>

      {/* Challenge Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-base font-semibold text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500 mt-1">{timeAgo}</p>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="px-4 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
          {difficulty}
        </span>
        <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-slate-800 text-white min-w-[60px] text-center">
          {percentage}%
        </span>
      </div>
    </div>
  );
}
