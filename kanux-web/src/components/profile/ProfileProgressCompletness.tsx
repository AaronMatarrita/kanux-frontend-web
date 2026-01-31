export function ProfileProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="w-full pt-4 mt-4 border-t border-gray-100">
      {/* labels */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col space-y-3">
          <span className="text-sm font-bold text-gray-800">Complete your profile</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Level of progress</span>
        </div>
        <span className="text-sm font-extrabold text-blue-600">
          {percentage}%
        </span>
      </div>

      {/* progress */}
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-in-out"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/*phrase*/}
      <p className="text-[11px] text-gray-400 mt-2 italic leading-tight">
        "The more information you provide on your profile, the better opportunities you'll receive."
      </p>
    </div>
  );
}