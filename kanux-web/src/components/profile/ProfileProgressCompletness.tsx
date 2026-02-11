export function ProfileProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="w-full pt-4 mt-4 border-t border-border">
      {/* labels */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col space-y-3">
          <span className="text-sm font-bold text-foreground">
            Complete your profile
          </span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Level of progress
          </span>
        </div>
        <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
          {percentage}%
        </span>
      </div>

      {/* progress */}
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className="bg-emerald-500 h-full rounded-full transition-all duration-1000 ease-in-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/*phrase*/}
      <p className="text-[11px] text-muted-foreground mt-2 italic leading-tight">
        "The more information you provide on your profile, the better
        opportunities you'll receive."
      </p>
    </div>
  );
}
