/**
 * Challenges Service
 * Access layer for challenges microservice (ms-challenges)
 *
 * All requests are proxied through API Gateway at /challenges
 */

import { httpClient } from "@/services/http";

// ============================================================================
// Request DTOs
// ============================================================================

export interface SubmitSoftChallengeRequest {
  id_profile: string;
  answers: Array<{
    question_id: string;
    selected_option_id: string;
  }>;
}

export interface SubmitTechnicalChallengeRequest {
  submission_id: string;
  programming_language: string;
  source_code: string;
}

export interface EvaluateChallengeRequest {
  [key: string]: unknown;
}

// ============================================================================
// Response DTOs
// ============================================================================

export interface Challenge {
  id: string;
  title: string;
  description?: string;
  type?: string;
  difficulty?: string;
  [key: string]: unknown;
}

export interface ChallengeMetrics {
  total_submissions: number;
  average_score: number;
}

export interface PublicTechnicalChallenge extends Challenge {
  metrics?: ChallengeMetrics;
}

export interface SoftChallenge {
  id: string;
  title: string;
  description?: string;
  non_technical_challenges: {
    non_technical_questions: Array<{
      id: string;
      question: string;
      non_technical_question_options: Array<{
        id: string;
        option_text: string;
      }>;
    }>;
  };
}

export interface ChallengeListResponse {
  data: Challenge[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

export interface ChallengeSubmissionResponse {
  submission_id: string;
  score: number;
  total_questions: number;
  correct_answers: number;
  feedback: string;
}

export interface TechnicalChallengeStartResponse {
  submission_id: string;
  status: "started" | "submitted";
}

export interface TechnicalChallengeSubmitResponse {
  submission_id: string;
  status: string;
}

export type ChallengeSubmissionsResponse = Array<{
  submission_id: string;
  challenge: {
    id: string;
    title: string;
    type: string;
    difficulty: string;
  };
  score: number;
  status: string;
  submitted_at: string;
}>;

export interface PublicTechnicalChallengesResponse {
  data: PublicTechnicalChallenge[];
  meta: {
    total_records: number;
    current_page: number;
    limit: number;
    total_pages: number;
  };
}

export interface PublicTechnicalChallengeDetailResponse {
  data: PublicTechnicalChallenge;
  assets: {
    challenge: unknown;
    test_cases: unknown;
  };
}

export interface TechnicalChallengeExecutionRequest {
  code: string;
  language?: "javascript" | "typescript";
  userId?: string;
}

export interface TechnicalChallengeExecutionResult {
  status: "ok" | "error";
  results?: Array<{
    id: string | number;
    description?: string;
    pass: boolean;
    expected: unknown;
    output: unknown;
    durationMs: number;
    error?: string;
  }>;
  logs?: string;
  error?: string;
  exitCode?: number;
}

// ============================================================================
// Service
// ============================================================================

export const challengesService = {
  // ========== Soft Challenges ==========

  /**
   * GET /challenges/soft-challenges?page=1&limit=10
   */
  listSoftChallenges: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<ChallengeListResponse> => {
    const res = await httpClient.get<ChallengeListResponse>(
      "/challenges/soft-challenges",
      { params: { page, limit } },
    );
    return res.data;
  },

  /**
   * GET /challenges/soft-challenges/:id
   */
  getSoftChallenge: async (id: string): Promise<SoftChallenge> => {
    const res = await httpClient.get<SoftChallenge>(
      `/challenges/soft-challenges/${id}`,
    );
    return res.data;
  },

  /**
   * POST /challenges/soft-challenges/:id/submit
   */
  submitSoftChallenge: async (
    id: string,
    data: SubmitSoftChallengeRequest,
  ): Promise<ChallengeSubmissionResponse> => {
    const res = await httpClient.post<ChallengeSubmissionResponse>(
      `/challenges/soft-challenges/${id}/submit`,
      data,
    );
    return res.data;
  },

  // ========== Technical Challenges ==========

  /**
   * POST /challenges/technical-challenges/:challengeId/start
   */
  startTechnicalChallenge: async (
    challengeId: string,
  ): Promise<TechnicalChallengeStartResponse> => {
    const res = await httpClient.post<{
      message: string;
      data: TechnicalChallengeStartResponse;
    }>(`/challenges/technical-challenges/${challengeId}/start`, {});
    return res.data.data;
  },

  /**
   * POST /challenges/technical-challenges/:challengeId/submit
   */
  submitTechnicalChallenge: async (
    challengeId: string,
    data: SubmitTechnicalChallengeRequest,
  ): Promise<TechnicalChallengeSubmitResponse> => {
    const res = await httpClient.post<TechnicalChallengeSubmitResponse>(
      `/challenges/technical-challenges/${challengeId}/submit`,
      data,
    );
    return res.data;
  },

  /**
   * GET /challenges/technical-challenges/challenge/submit-challenges
   */
  getMyChallengeHistory: async (): Promise<ChallengeSubmissionsResponse> => {
    const res = await httpClient.get<ChallengeSubmissionsResponse>(
      "/challenges/technical-challenges/challenge/submit-challenges",
    );
    return res.data;
  },

  // ========== General Challenges ==========

  /**
   * GET /challenges/challenges?page=1&limit=10
   */
  listChallenges: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<ChallengeListResponse> => {
    const res = await httpClient.get<ChallengeListResponse>(
      "/challenges/challenges",
      { params: { page, limit } },
    );
    return res.data;
  },

  /**
   * GET /challenges/challenges/:id_company?page=1&limit=10
   */
  getChallengesByCompany: async (
    companyId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ChallengeListResponse> => {
    const res = await httpClient.get<ChallengeListResponse>(
      `/challenges/challenges/${companyId}`,
      { params: { page, limit } },
    );
    return res.data;
  },

  /**
   * GET /challenges/challenges/:id_challenge/submissions/:id_company
   */
  getSubmissionsByChallenge: async (
    challengeId: string,
    companyId: string,
  ): Promise<ChallengeSubmissionsResponse> => {
    const res = await httpClient.get<ChallengeSubmissionsResponse>(
      `/challenges/challenges/${challengeId}/submissions/${companyId}`,
    );
    return res.data;
  },

  /**
   * POST /challenges/internal/technical-challenges/:challengeId/execute
   * Proxy to ms-runner through ms-challenges. Executes code against test cases.
   */
  executeTechnicalChallenge: async (
    challengeId: string,
    payload: TechnicalChallengeExecutionRequest,
  ): Promise<TechnicalChallengeExecutionResult> => {
    const { code, language, userId } = payload;
    const runnerAuthToken = process.env.NEXT_PUBLIC_RUNNER_AUTH_TOKEN;
    const runnerInternalToken = process.env.NEXT_PUBLIC_RUNNER_INTERNAL_TOKEN;
    const res = await httpClient.post<{
      message: string;
      data: TechnicalChallengeExecutionResult;
    }>(
      `/challenges/internal/technical-challenges/${challengeId}/execute`,
      {
        source_code: code,
        programming_language: language,
        user_id: userId,
      },
      {
        headers: {
          ...(runnerAuthToken ? { "x-runner-token": runnerAuthToken } : {}),
          ...(runnerInternalToken
            ? { "x-internal-token": runnerInternalToken }
            : {}),
        },
      },
    );
    // ms-challenges wraps runner response in { message, data: {...} }
    return res.data.data || res.data;
  },

  /**
   * POST /challenges/submissions/:id_submission/evaluate
   */
  evaluateChallenge: async (
    submissionId: string,
    data: EvaluateChallengeRequest,
  ): Promise<{ success: boolean }> => {
    const res = await httpClient.post<{ success: boolean }>(
      `/challenges/submissions/${submissionId}/evaluate`,
      data,
    );
    return res.data;
  },

  // ========== Public Technical Challenges ==========

  /**
   * GET /challenges/public/technical?page=1&limit=10
   * Public listing filtered to technical challenges only.
   */
  listPublicTechnicalChallenges: async (
    page: number = 1,
    limit: number = 1,
  ): Promise<PublicTechnicalChallengesResponse> => {
    const res = await httpClient.get<PublicTechnicalChallengesResponse>(
      "/challenges/technical-challenges/public",
      { params: { page, limit } },
    );
    return res.data;
  },

  /**
   * GET /challenges/public/technical/:challengeId
   * Returns challenge metadata plus bundled assets (challenge + test_cases).
   */
  getPublicTechnicalChallengeDetail: async (
    challengeId: string,
  ): Promise<PublicTechnicalChallengeDetailResponse> => {
    const res = await httpClient.get<PublicTechnicalChallengeDetailResponse>(
      `/challenges/technical-challenges/public/${challengeId}`,
    );
    return res.data;
  },
};
