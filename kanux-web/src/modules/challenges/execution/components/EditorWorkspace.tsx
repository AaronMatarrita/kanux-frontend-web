"use client";

import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { LanguageSelector, ProgrammingLanguage } from "./LanguageSelector";
import { MonacoEditorWrapper } from "./MonacoEditorWrapper";
import { ConsolePanel } from "./ConsolePanel";

interface EditorWorkspaceProps {
  initialCode?: string;
  initialLanguage?: ProgrammingLanguage;
  onRun?: (
    code: string,
    language: ProgrammingLanguage,
  ) => Promise<{ output?: string; error?: string } | void>;
  runningExternal?: boolean;
  outputExternal?: string;
  errorExternal?: string;
}

export function EditorWorkspace({
  initialCode = "// Your implementation here...",
  initialLanguage = "javascript",
  onRun,
  runningExternal,
  outputExternal,
  errorExternal,
}: EditorWorkspaceProps) {
  const [language, setLanguage] =
    useState<ProgrammingLanguage>(initialLanguage);
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);

  // Sync code/language when props change after async load
  useEffect(() => {
    setCode(initialCode || "");
  }, [initialCode]);

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);

  // Sync external output/error/running when provided
  useEffect(() => {
    if (typeof outputExternal === "string") {
      setOutput(outputExternal);
    }
  }, [outputExternal]);

  useEffect(() => {
    if (typeof errorExternal === "string") {
      setError(errorExternal);
    }
  }, [errorExternal]);

  useEffect(() => {
    if (typeof runningExternal === "boolean") {
      setRunning(runningExternal);
    }
  }, [runningExternal]);

  const handleRun = async () => {
    if (running) return;
    setRunning(true);
    setOutput("");
    setError("");

    try {
      if (onRun) {
        const result = await onRun(code, language);
        if (result?.output !== undefined) setOutput(result.output);
        if (result?.error !== undefined) setError(result.error);
      } else {
        // Mock simulation
        await new Promise((resolve) => setTimeout(resolve, 800));
        setOutput("// Code execution not yet connected to backend");
      }
    } catch (err: any) {
      setError(err.message || "Execution failed");
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header: Language selector + Run button */}
      <div className="flex items-center justify-between p-3 bg-white border-b border-slate-200">
        <LanguageSelector
          value={language}
          onChange={setLanguage}
          disabled={running}
        />
        <button
          type="button"
          onClick={handleRun}
          disabled={running}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-4 h-4" />
          {running ? "Running..." : "Run Code"}
        </button>
      </div>

      {/* Editor and Console Container */}
      <div className="flex-1 min-h-0 flex flex-col gap-0">
        {/* Editor */}
        <div className="flex-1 min-h-0">
          <MonacoEditorWrapper
            language={language}
            value={code}
            onChange={(val) => setCode(val || "")}
            height="100%"
          />
        </div>

        {/* Console - Takes up more space */}
        <div className="h-72 border-t border-slate-700 shrink-0">
          <ConsolePanel output={output} error={error} />
        </div>
      </div>
    </div>
  );
}
