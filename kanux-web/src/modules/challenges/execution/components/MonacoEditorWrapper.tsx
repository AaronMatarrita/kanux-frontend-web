"use client";

import Editor from "@monaco-editor/react";

interface MonacoEditorWrapperProps {
  language: string;
  value: string;
  onChange: (value: string | undefined) => void;
  height?: string;
  readOnly?: boolean;
}

export function MonacoEditorWrapper({
  language,
  value,
  onChange,
  height = "400px",
  readOnly = false,
}: MonacoEditorWrapperProps) {
  return (
    <Editor
      height={height}
      language={language}
      value={value}
      onChange={onChange}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        readOnly,
        wordWrap: "on",
      }}
      loading={
        <div className="flex items-center justify-center h-full bg-[#1e1e1e] text-slate-400">
          Loading editor...
        </div>
      }
    />
  );
}
