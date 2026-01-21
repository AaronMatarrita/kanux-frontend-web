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
  [key: string]: any;
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
  [key: string]: any;
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
    const res = await httpClient.post<TechnicalChallengeStartResponse>(
      `/challenges/technical-challenges/${challengeId}/start`,
      {}, // el backend usa el param, no necesita body
    );
    return res.data;
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
   * POST /challenges/submissions/:id_submission/evaluate
   */
  evaluateChallenge: async (
    submissionId: string,
    data: EvaluateChallengeRequest,
  ): Promise<any> => {
    const res = await httpClient.post<any>(
      `/challenges/submissions/${submissionId}/evaluate`,
      data,
    );
    return res.data;
  },
};
