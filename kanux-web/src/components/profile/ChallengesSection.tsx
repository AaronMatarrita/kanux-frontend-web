import { ChallengeSubmissionsResponse } from "@/services/challenges.service";
import { ChallengeItem } from "./ChallengeItem";
import { formatTimeAgo } from "../../helper/formats";

export function ChallengesSection({
  challenges,
  isLoading,
}: {
  challenges: Array<ChallengeSubmissionsResponse[number]>;
  isLoading: boolean;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-foreground">
        Completed Challenges
      </h3>
      <div className="bg-card rounded-lg border border-border p-2">
        {challenges.map((submission) => (
          <ChallengeItem
            key={submission.submission_id}
            title={submission.challenge.title}
            difficulty={submission.challenge.difficulty}
            score={submission.score}
            timeAgo={formatTimeAgo(submission.submitted_at)}
          />
        ))}
      </div>
    </div>
  );
}
