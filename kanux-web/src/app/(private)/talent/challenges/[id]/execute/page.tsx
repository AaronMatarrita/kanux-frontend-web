import { ExecutionTopbar } from "@/modules/challenges/execution/components/ExecutionTopbar";

export default function Page() {
  return (
    <div className="h-screen flex flex-col">
      {/* Topbar */}
      <ExecutionTopbar
        title="Advanced React Patterns"
        subtitle="Implement a Flexible Modal System"
        difficulty="advanced"
        timeLabel="1:59:35"
      />

      {/* Execution Layout */}
      <div className="flex-1 bg-white">
        <div className="h-full grid grid-cols-1 lg:grid-cols-[280px_1fr_280px]">
          {/* Left Sidebar */}
          <div className="h-full bg-slate-100 p-4 border-r border-slate-200 overflow-auto">
            <p className="text-sm font-semibold text-slate-700">Left Panel</p>
            <p className="text-xs text-slate-500">
              This is where the challenge description, instructions, or files
              would go.
            </p>
          </div>

          {/* Center Content */}
          <div className="h-full bg-white p-4 border-r border-slate-200 overflow-auto">
            <p className="text-sm font-semibold text-slate-700">
              Main Execution Area
            </p>
            <p className="text-xs text-slate-500">
              This is the primary workspace for the challenge execution UI.
            </p>
          </div>

          {/* Right Sidebar */}
          <div className="h-full bg-slate-100 p-4 overflow-auto">
            <p className="text-sm font-semibold text-slate-700">
              Right Sidebar
            </p>
            <p className="text-xs text-slate-500">
              This is where the challenge test cases results would be displayed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
