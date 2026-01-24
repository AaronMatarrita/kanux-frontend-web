"use client";

/* Types */

export type TestCaseStatus = "pending" | "passed" | "failed";

export interface TestCaseItemData {
  id: string | number;
  description?: string;
  input?: unknown;
  expected_output?: unknown;
  status: TestCaseStatus;
}

interface TestCasesPanelProps {
  testCases?: TestCaseItemData[];
}

/* Status UI Config */

const STATUS_UI: Record<
  TestCaseStatus,
  { dot: string; badge: string; label: string }
> = {
  pending: {
    dot: "bg-slate-200 border border-slate-300",
    badge: "bg-slate-100 text-slate-700",
    label: "Pending",
  },
  passed: {
    dot: "bg-emerald-100 border border-emerald-300",
    badge: "bg-emerald-50 text-emerald-700",
    label: "Passed",
  },
  failed: {
    dot: "bg-rose-100 border border-rose-300",
    badge: "bg-rose-50 text-rose-700",
    label: "Failed",
  },
};

/* Helpers */

function normalizeTestCases(data: TestCaseItemData[] = []): TestCaseItemData[] {
  return data.map((tc) => ({
    ...tc,
    status: tc.status || "pending",
  }));
}

function getCounts(testCases: TestCaseItemData[]) {
  return testCases.reduce(
    (acc, tc) => {
      acc.total++;
      acc[tc.status]++;
      return acc;
    },
    { total: 0, passed: 0, failed: 0, pending: 0 } as Record<
      TestCaseStatus | "total",
      number
    >,
  );
}

/* UI Pieces */

function StatusDot({ status }: { status: TestCaseStatus }) {
  return (
    <span
      className={`inline-flex h-4 w-4 rounded-full ${STATUS_UI[status].dot}`}
      aria-label={status}
    />
  );
}

function StatusBadge({ status }: { status: TestCaseStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_UI[status].badge}`}
    >
      {STATUS_UI[status].label.toLowerCase()}
    </span>
  );
}

function TestCaseItem({ testCase }: { testCase: TestCaseItemData }) {
  return (
    <div
      className="
        border border-slate-200 rounded-lg p-3 
        bg-white 
        transition-colors
        hover:bg-slate-50
      "
    >
      <div className="flex items-start gap-3">
        <StatusDot status={testCase.status} />

        <div className="flex-1 min-w-0 space-y-1">
          {/* Título SIN truncate */}
          <div className="text-sm font-medium text-slate-900 leading-snug">
            {testCase.description || `Test case ${testCase.id}`}
          </div>

          {/* Badge */}
          <div>
            <StatusBadge status={testCase.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between text-slate-700">
      <span>{label}:</span>
      <span className={`flex items-center gap-1 ${color}`}>
        <span className="inline-block h-2 w-2 rounded-full bg-current" />
        {value}
      </span>
    </div>
  );
}

function TestCasesSummary({
  passed,
  failed,
  pending,
}: {
  passed: number;
  failed: number;
  pending: number;
}) {
  return (
    <div className="mt-4 border border-slate-200 rounded-xl p-4 bg-white shadow-sm text-sm">
      <div className="space-y-1">
        <SummaryItem label="Passed" value={passed} color="text-emerald-700" />
        <SummaryItem label="Failed" value={failed} color="text-rose-700" />
        <SummaryItem label="Pending" value={pending} color="text-slate-700" />
      </div>
    </div>
  );
}

/* Main Panel */

export function TestCasesPanel({ testCases = [] }: TestCasesPanelProps) {
  const normalized = normalizeTestCases(testCases);
  const counts = getCounts(normalized);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="pb-3">
        <h3 className="text-sm font-semibold text-slate-900">Test Cases</h3>
        <p className="text-xs text-slate-500">
          {counts.total} total · {counts.passed} passed · {counts.failed} failed
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto space-y-3 pr-1">
        {normalized.length === 0 ? (
          <div className="text-sm text-slate-500">No test cases available.</div>
        ) : (
          normalized.map((tc) => <TestCaseItem key={tc.id} testCase={tc} />)
        )}
      </div>

      {/* Summary */}
      <TestCasesSummary
        passed={counts.passed}
        failed={counts.failed}
        pending={counts.pending}
      />
    </div>
  );
}
