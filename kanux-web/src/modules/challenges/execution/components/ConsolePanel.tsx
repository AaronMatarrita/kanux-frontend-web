"use client";

import { useState } from "react";

interface ConsolePanelProps {
  output?: string;
  error?: string;
}

type TabType = "console" | "output";

export function ConsolePanel({ output = "", error = "" }: ConsolePanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("console");

  const hasOutput = output.trim().length > 0;
  const hasError = error.trim().length > 0;

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-t border-border">
      {/* Tabs */}
      <div className="flex items-center gap-1 px-2 bg-[#252526] border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("console")}
          className={`px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === "console"
              ? "text-white border-b-2 border-emerald-500"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Console
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("output")}
          className={`px-3 py-2 text-xs font-medium transition-colors ${
            activeTab === "output"
              ? "text-white border-b-2 border-emerald-500"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Output
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-3 font-mono text-xs">
        {activeTab === "console" && (
          <div>
            {!hasOutput && !hasError ? (
              <div className="text-slate-500">
                Run your code to see output...
              </div>
            ) : (
              <>
                {hasError && (
                  <pre className="text-red-400 whitespace-pre-wrap">
                    {error}
                  </pre>
                )}
                {hasOutput && (
                  <pre className="text-slate-200 whitespace-pre-wrap">
                    {output}
                  </pre>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "output" && (
          <div>
            {!hasOutput ? (
              <div className="text-slate-500">No output yet...</div>
            ) : (
              <pre className="text-slate-200 whitespace-pre-wrap">{output}</pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
