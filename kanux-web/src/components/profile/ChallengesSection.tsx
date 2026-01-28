import { ChallengeItem } from "./ChallengeItem";
import { ChallengeItemSkeleton } from "./ChallengeItemSkeleton";

export function ChallengesSection({ challenges, isLoading}: {
  challenges: Array<{
    title: string;
    timeAgo: string;
    difficulty: string;
    percentage: number;
  }>, 
  isLoading: boolean
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-900">Completed Challenges</h3>
      {isLoading? (
        <div>
          <ChallengeItemSkeleton />
          <ChallengeItemSkeleton />
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-2">
          {challenges.map((challenge, index) => (
            <ChallengeItem
              key={index}
              title={challenge.title}
              timeAgo={challenge.timeAgo}
              difficulty={challenge.difficulty}
              percentage={challenge.percentage}
            />
          ))}
        </div>
      )}
    </div>
  );
}
