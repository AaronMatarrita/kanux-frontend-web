export type NormalizedFeedback = {
  markdown?: string;
  finalScore?: number;
};

function sanitizeJsonString(input: string): string {
  return input
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
    const parsed = JSON.parse(feedback);
    console.log("[normalizeFeedback] first parse result:", parsed);

    let realFeedback = parsed;

    if (typeof parsed?.raw === "string") {
      console.log("[normalizeFeedback] raw detected, sanitizing...");

      const sanitizedRaw = sanitizeJsonString(parsed.raw);

      console.log("[normalizeFeedback] sanitized raw:", sanitizedRaw);

      realFeedback = JSON.parse(sanitizedRaw);
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
        ? normalizeMarkdown(realFeedback.markdown)
        : undefined,
      finalScore: hasFinalScore ? realFeedback.final_score : undefined,
    };

    console.log("[normalizeFeedback] normalized feedback result:", normalized);

    return normalized;
  } catch (error) {
    console.error("[normalizeFeedback] unrecoverable parse error:", error);
    return {};
  }
}
