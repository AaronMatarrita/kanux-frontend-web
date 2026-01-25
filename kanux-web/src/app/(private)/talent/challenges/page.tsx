"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChallengesHeader } from "@/modules/challenges/components/ChallengesHeader";
import { AllChallengesTab } from "@/modules/challenges/components/AllChallengesTab";
import { InProgressTab } from "@/modules/challenges/components/InProgressTab";
import { CompletedTab } from "@/modules/challenges/components/CompletedTab";
import { useChallenges } from "@/modules/challenges/hooks/useChallenges";

export default function Page() {
  const {
    challengeType,
    displayChallenges,
    completedChallenges,
    loading,
    loadingCompleted,
    error,
    errorCompleted,
    currentPage,
    totalPages,
    setChallengeType,
    setCurrentPage,
    loadChallenges,
    loadCompletedChallenges,
  } = useChallenges();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <ChallengesHeader
        challengeType={challengeType}
        onTypeChange={(type) => {
          setChallengeType(type);
          setCurrentPage(1);
        }}
      />

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="all">All Challenges</TabsTrigger>

          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <AllChallengesTab
            challenges={displayChallenges}
            loading={loading}
            error={error}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onRetry={loadChallenges}
          />
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6">
          <InProgressTab />
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <CompletedTab
            challenges={completedChallenges}
            loading={loadingCompleted}
            error={errorCompleted}
            onRetry={loadCompletedChallenges}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
