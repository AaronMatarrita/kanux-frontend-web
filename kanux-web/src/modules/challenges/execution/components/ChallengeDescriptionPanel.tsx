"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface ChallengeAssets {
  description?: string;
  constraints?: string[];
  requirements?: string[];
  examples?: Array<{
    input: any;
    output: any;
    explanation?: string;
  }>;
  expected_output?: string;
  [key: string]: any;
}

interface ChallengeDescriptionPanelProps {
  headerTitle?: string;
  assets?: ChallengeAssets;
  loading?: boolean;
}

function HeaderTitle({ title }: { title: string }) {
  return (
    <div className="px-4 py-3 border-b border-border bg-background">
      <h2 className="text-base font-bold text-foreground">{title}</h2>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
      {children}
    </div>
  );
}

function MarkdownRenderer({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");

            if (!inline && match) {
              return (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  wrapLongLines
                  className="rounded-md text-xs"
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              );
            }

            return (
              <code
                className="bg-muted rounded px-1 py-0.5 text-[0.85em] text-foreground"
                {...props}
              >
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({ value }: { value: any }) {
  const content =
    typeof value === "string"
      ? value
      : `\`\`\`json\n${JSON.stringify(value, null, 2)}\n\`\`\``;

  return (
    <div className="bg-muted/40 rounded border border-border p-3 overflow-x-auto">
      <MarkdownRenderer
        content={content}
        className="[&>pre]:m-0 [&>pre]:text-xs"
      />
    </div>
  );
}

function ExampleCard({
  input,
  output,
  explanation,
}: {
  input: any;
  output: any;
  explanation?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Input
      </div>
      <CodeBlock value={input} />

      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-3">
        Output
      </div>
      <CodeBlock value={output} />

      {explanation && (
        <div className="text-xs text-muted-foreground mt-2">
          <MarkdownRenderer content={explanation} />
        </div>
      )}
    </div>
  );
}

export function ChallengeDescriptionPanel({
  headerTitle = "Instrucciones",
  assets,
  loading = false,
}: ChallengeDescriptionPanelProps) {
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner size="md" message="Cargando challenge..." />
      </div>
    );
  }

  if (!assets) {
    return (
      <div className="h-full flex items-center justify-center">
        <span className="text-sm text-muted-foreground">
          No challenge data available
        </span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <HeaderTitle title={headerTitle} />

      <div className="flex-1 overflow-auto bg-background">
        <div className="p-4 space-y-6">
          {/* Description */}
          {assets.description && (
            <MarkdownRenderer
              content={assets.description}
              className="text-sm text-muted-foreground leading-relaxed"
            />
          )}

          {/* Requirements */}
          {assets.requirements?.length && (
            <Section title="Your implementation should support:">
              <ul className="text-sm text-muted-foreground space-y-1.5">
                {assets.requirements.map((req, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-muted-foreground/60">-</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Constraints */}
          {assets.constraints?.length && (
            <Section title="Constraints">
              <ul className="text-sm text-muted-foreground space-y-1.5">
                {assets.constraints.map((c, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-muted-foreground/60">•</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* Examples */}
          {assets.examples?.length && (
            <Section title="Examples">
              <div className="space-y-4">
                {assets.examples.map((ex, i) => (
                  <ExampleCard key={i} {...ex} />
                ))}
              </div>
            </Section>
          )}

          {/* Expected Output */}
          {assets.expected_output && (
            <Section title="Output">
              <MarkdownRenderer
                content={assets.expected_output}
                className="text-sm text-muted-foreground leading-relaxed"
              />
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}
