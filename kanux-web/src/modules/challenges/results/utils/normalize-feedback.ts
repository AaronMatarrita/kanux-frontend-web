export type NormalizedFeedback = {
  markdown?: string;
  finalScore?: number;
};

function safeJsonParse<T = unknown>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.warn("[normalizeFeedback] JSON parse failed", error);
    return null;
  }
}

function sanitizeJsonString(input: string): string {
  const stripped = input
    .trim()
    .replace(/^```[a-zA-Z0-9]*\s*\n?/, "")
    .replace(/\n?```\s*$/, "");

  return stripped
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

function normalizeMarkdown(md: string): string {
  const normalized = md
    .replace(/\\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\*\*(\d+%)\n/g, "**$1**\n")
    .replace(/## Fuertes\b/g, "## Fortalezas")
    .trim();

  return normalized;
}

export function normalizeFeedback(
  feedback?: string | null,
): NormalizedFeedback {
  if (!feedback || typeof feedback !== "string") {
    console.warn("[normalizeFeedback] feedback is empty or not a string");
    return {};
  }

  try {
    const parsed = safeJsonParse<Record<string, unknown>>(feedback);

    if (!parsed) {
      console.warn(
        "[normalizeFeedback] feedback not JSON, returning markdown fallback",
      );
      return { markdown: normalizeMarkdown(feedback) };
    }

    let realFeedback = parsed;

    if (typeof parsed?.raw === "string") {
      console.log("[normalizeFeedback] raw detected, sanitizing...");

      const sanitizedRaw = sanitizeJsonString(parsed.raw);

      console.log("[normalizeFeedback] sanitized raw:", sanitizedRaw);

      const parsedRaw = safeJsonParse<Record<string, unknown>>(sanitizedRaw);

      if (parsedRaw) {
        realFeedback = parsedRaw;
      } else {
        console.warn(
          "[normalizeFeedback] raw content still invalid after sanitizing",
        );
      }
    }

    console.log("[normalizeFeedback] real feedback object:", realFeedback);

    if (typeof realFeedback !== "object" || realFeedback === null) {
      console.error("[normalizeFeedback] real feedback is invalid");
      return {};
    }

    const hasMarkdown = typeof realFeedback.markdown === "string";
    const hasFinalScore = typeof realFeedback.final_score === "number";

    console.log("[normalizeFeedback] has markdown:", hasMarkdown);
    console.log("[normalizeFeedback] has final_score:", hasFinalScore);

    const normalized: NormalizedFeedback = {
      markdown: hasMarkdown
        ? normalizeMarkdown(realFeedback.markdown as string)
        : undefined,
      finalScore: hasFinalScore
        ? (realFeedback.final_score as number)
        : undefined,
    };

    console.log("[normalizeFeedback] normalized feedback result:", normalized);

    return normalized;
  } catch (error) {
    console.error("[normalizeFeedback] unrecoverable parse error:", error);
    return {};
  }
}
