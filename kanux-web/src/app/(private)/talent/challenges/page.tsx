import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ChallengeCard } from "@/components/ui/challenge-card";

export default function Page() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Challenges</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Practice your skills, track your progress and demonstrate your
          capabilities through real-world challenges.
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="all">All Challenges</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {/* ALL */}
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))] transition-[grid-template-columns,gap] duration-300 ease-in-out">
            <ChallengeCard
              id="1"
              title="Advanced React Patterns"
              description="Master compound components, render props, and custom hooks in complex scenarios."
              difficulty="hard"
              duration="2–3 hours"
            />

            <ChallengeCard
              id="550e8400-e29b-41d4-a716-446655440005"
              title="Build a REST API with Authentication"
              description="Create a secure REST API with authentication, RBAC and proper error handling using best practices."
              difficulty="medium"
              duration="3–4 hours"
            />

            <ChallengeCard
              id="1"
              title="Advanced React Patterns"
              description="Master compound components, render props, and custom hooks in complex scenarios."
              difficulty="hard"
              duration="2–3 hours"
            />

            <ChallengeCard
              id="550e8400-e29b-41d4-a716-446655440005"
              title="Build a REST API with Authentication"
              description="Create a secure REST API with authentication, RBAC and proper error handling using best practices."
              difficulty="medium"
              duration="3–4 hours"
            />

            <ChallengeCard
              id="1"
              title="Advanced React Patterns"
              description="Master compound components, render props, and custom hooks in complex scenarios."
              difficulty="hard"
              duration="2–3 hours"
            />

            <ChallengeCard
              id="550e8400-e29b-41d4-a716-446655440005"
              title="Build a REST API with Authentication"
              description="Create a secure REST API with authentication, RBAC and proper error handling using best practices."
              difficulty="medium"
              duration="3–4 hours"
            />
          </div>
        </TabsContent>

        {/* IN PROGRESS */}
        <TabsContent value="in-progress" className="mt-6">
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            <ChallengeCard
              id="550e8400-e29b-41d4-a716-446655440005"
              title="Build a REST API with Authentication"
              description="Create a secure REST API with authentication, RBAC and proper error handling using best practices."
              difficulty="medium"
              duration="3–4 hours"
            />
          </div>
        </TabsContent>

        {/* COMPLETED */}
        <TabsContent value="completed" className="mt-6">
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            <ChallengeCard
              id="550e8400-e29b-41d4-a716-446655440005"
              title="Build a REST API with Authentication"
              description="Create a secure REST API with authentication, RBAC and proper error handling using best practices."
              difficulty="medium"
              duration="3–4 hours"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
