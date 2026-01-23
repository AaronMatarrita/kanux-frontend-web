import { ExecutionTopbar } from "@/modules/challenges/execution/components/ExecutionTopbar";
// UI-only route for challenge technical execution
// No implementation yet; will compose domain container from src/modules/challenges/execution/pages
export default function Page() {
  return (
    <div className="space-y-4">
      <ExecutionTopbar
        title="Advanced React Patterns"
        subtitle="Implement a Flexible Modal System"
        difficulty="advanced"
        timeLabel="1:59:35"
      />

      {/* Rest of the execution layout will be composed below (UI-only) */}
      <div className="px-4 sm:px-6 lg:px-8">
        <p className="text-slate-600">
          Placeholder route ready for composition
        </p>
      </div>
    </div>
  );
}
