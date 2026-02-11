export type NormalizedFeedback = {
  markdown?: string;
  finalScore?: number;
  summary?: string;
  strengths?: string[];
  areasForImprovement?: string[];
  nextSteps?: string[];
  answersOverview?: {
    total?: number;
    correct?: number;
    incorrect?: number;
  };
  perQuestionFeedback?: Array<{
    questionId?: string;
    correct?: boolean;
    explanation?: string;
  }>;
  scoreBreakdown?: Record<string, number>;
  tests?: {
    total?: number;
    passed?: number;
    failed?: number;
    details?: unknown;
  };
  codeQuality?: Record<string, number>;
  title?: string;
  type?: string;
  tags?: string[];
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
    .replace(/\r\n/g, "\n")
    .replace(/(^|[^\n])\s(#{1,6}\s)/g, "$1\n$2")
    .replace(/(^|[^\n])\s-\s(?=\S)/g, "$1\n- ")
    .replace(/([^\n])\s\|\s/g, "$1\n| ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\*\*(\d+%)\n/g, "**$1**\n")
    .replace(/## Fuertes\b/g, "## Fortalezas")
    .trim();

  return normalized;
}

type FeedbackPayload = {
  markdown?: string;
  final_score?: number;
  summary?: string;
  strengths?: unknown;
  areas_for_improvement?: unknown;
  next_steps?: unknown;
  answers_overview?: {
    total?: unknown;
    correct?: unknown;
    incorrect?: unknown;
  };
  per_question_feedback?: unknown;
  score_breakdown?: Record<string, unknown>;
  tests?: {
    total?: unknown;
    passed?: unknown;
    failed?: unknown;
    details?: unknown;
  };
  code_quality?: Record<string, unknown>;
  title?: string;
  type?: string;
  tags?: unknown;
  raw?: string;
  feedback?: unknown;
};

function extractFeedbackPayload(input: unknown): FeedbackPayload | null {
  if (!input) return null;

  if (typeof input === "string") {
    const parsed = safeJsonParse<FeedbackPayload>(input);
    if (parsed) return parsed;
    return { markdown: input };
  }

  if (typeof input === "object") {
    const payload = input as FeedbackPayload;
    if (payload.feedback) {
      return extractFeedbackPayload(payload.feedback) ?? payload;
    }
    return payload;
  }

  return null;
}

function normalizePayload(payload: FeedbackPayload): NormalizedFeedback {
  if (typeof payload.raw === "string") {
    const sanitizedRaw = sanitizeJsonString(payload.raw);
    const parsedRaw = safeJsonParse<FeedbackPayload>(sanitizedRaw);
    if (parsedRaw) return normalizePayload(parsedRaw);
  }

  const markdown =
    typeof payload.markdown === "string"
      ? normalizeMarkdown(payload.markdown)
      : undefined;
  const finalScore =
    typeof payload.final_score === "number" ? payload.final_score : undefined;
  const summary =
    typeof payload.summary === "string" ? payload.summary : undefined;
  const strengths = normalizeStringArray(payload.strengths);
  const areasForImprovement = normalizeStringArray(
    payload.areas_for_improvement,
  );
  const nextSteps = normalizeStringArray(payload.next_steps);
  const answersOverview = normalizeAnswersOverview(payload.answers_overview);
  const perQuestionFeedback = normalizePerQuestionFeedback(
    payload.per_question_feedback,
  );
  const scoreBreakdown = normalizeNumberRecord(payload.score_breakdown);
  const tests = normalizeTests(payload.tests);
  const codeQuality = normalizeNumberRecord(payload.code_quality);
  const title = typeof payload.title === "string" ? payload.title : undefined;
  const type = typeof payload.type === "string" ? payload.type : undefined;
  const tags = normalizeStringArray(payload.tags);

  return {
    markdown,
    finalScore,
    summary,
    strengths,
    areasForImprovement,
    nextSteps,
    answersOverview,
    perQuestionFeedback,
    scoreBreakdown,
    tests,
    codeQuality,
    title,
    type,
    tags,
  };
}

export function normalizeFeedback(feedback?: unknown): NormalizedFeedback {
  if (!feedback) {
    return {};
  }

  try {
    const payload = extractFeedbackPayload(feedback);
    if (!payload) return {};
    return normalizePayload(payload);
  } catch (error) {
    console.error("[normalizeFeedback] unrecoverable parse error:", error);
    return {};
  }
}

function normalizeStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const normalized = value.filter(
    (item): item is string => typeof item === "string",
  );
  return normalized.length > 0 ? normalized : undefined;
}

function normalizeNumberRecord(
  value?: Record<string, unknown>,
): Record<string, number> | undefined {
  if (!value || typeof value !== "object") return undefined;

  const entries = Object.entries(value).filter(
    (entry): entry is [string, number] => typeof entry[1] === "number",
  );

  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries);
}

function normalizeTests(
  value?: FeedbackPayload["tests"],
): NormalizedFeedback["tests"] {
  if (!value || typeof value !== "object") return undefined;

  const total = typeof value.total === "number" ? value.total : undefined;
  const passed = typeof value.passed === "number" ? value.passed : undefined;
  const failed = typeof value.failed === "number" ? value.failed : undefined;

  if (!total && !passed && !failed && !value.details) return undefined;

  return {
    total,
    passed,
    failed,
    details: value.details,
  };
}

function normalizeAnswersOverview(
  value?: FeedbackPayload["answers_overview"],
): NormalizedFeedback["answersOverview"] {
  if (!value || typeof value !== "object") return undefined;

  const total = typeof value.total === "number" ? value.total : undefined;
  const correct = typeof value.correct === "number" ? value.correct : undefined;
  const incorrect =
    typeof value.incorrect === "number" ? value.incorrect : undefined;

  if (!total && !correct && !incorrect) return undefined;

  return { total, correct, incorrect };
}

function normalizePerQuestionFeedback(
  value?: FeedbackPayload["per_question_feedback"],
): NormalizedFeedback["perQuestionFeedback"] {
  if (!Array.isArray(value)) return undefined;

  type NormalizedItem = {
    questionId?: string;
    correct?: boolean;
    explanation?: string;
  };

  const normalized = value
    .map((item): NormalizedItem | null => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const questionId =
        typeof record.question_id === "string" ? record.question_id : undefined;
      const correct =
        typeof record.correct === "boolean" ? record.correct : undefined;
      const explanation =
        typeof record.explanation === "string" ? record.explanation : undefined;

      if (!questionId && correct === undefined && !explanation) return null;

      return { questionId, correct, explanation };
    })
    .filter((item): item is NormalizedItem => item !== null);

  return normalized.length > 0 ? normalized : undefined;
}
