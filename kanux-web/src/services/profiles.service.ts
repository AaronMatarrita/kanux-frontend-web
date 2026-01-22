/**
 * Profiles Service
 * Access layer for profiles microservice (ms-profiles)
 *
 * All requests are proxied through API Gateway at /profiles
 */

import { httpClient } from "@/services/http";

// ============================================================================
// Request DTOs
// ============================================================================

export interface UpdateTalentProfileRequest {
  first_name?: string;
  last_name?: string;
  title?: string;
  location?: string;
  experience_level?: string;
  education?: string;
  about?: string;
  contact?: Record<string, unknown>;
  learning_background_id?: string;
  opportunity_status_id?: string;
}

export interface CreateSkillRequest {
  category_id: string;
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface CreateLanguageRequest {
  language_id: string;
  level: "Básico" | "Intermedio" | "Avanzado";
}

// ============================================================================
// Response DTOs
// ============================================================================

export interface TalentProfile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  title?: string;
  location?: string;
  experience_level?: string;
  education?: string;
  about?: string;
  contact?: Record<string, unknown>;
  profile_completeness?: number;

  skills?: Skill[];
  languages_talent?: Language[];

  learning_backgrounds?: { id: string; name: string };
  opportunity_statuses?: { id: string; name: string };
}

export interface Skill {
  id: string | number;
  id_profile?: string;
  id_category?: string;
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
  category?: {
    id: string;
    name: string;
  };
}

export interface Language {
  id: string;
  id_profile?: string;
  id_languages?: string;
  level: "Básico" | "Intermedio" | "Avanzado";
  languages?: {
    id: string;
    name: string;
  };
}

export interface Catalogs {
  categories: Array<{ id: string; name: string }>;
  languages: Array<{ id: string; name: string }>;
  learning_backgrounds: Array<{ id: string; name: string }>;
  opportunity_statuses: Array<{ id: string; name: string }>;
}

// ============================================================================
// Service
// ============================================================================

export const profilesService = {
  /**
   * GET /profiles/me
   * Get current user's profile (requires auth)
   */
  getMyProfile: async (): Promise<TalentProfile> => {
    const res = await httpClient.get<TalentProfile>("/profiles/me");
    return res.data;
  },

  /**
   * GET /profiles/talent/:id
   * Get public talent profile by ID
   */
  getPublicTalentProfile: async (id: string): Promise<TalentProfile> => {
    const res = await httpClient.get<TalentProfile>(`/profiles/talent/${id}`);
    return res.data;
  },

  /**
   * PUT /profiles/me
   * Update current user's profile (requires auth)
   */
  updateMyProfile: async (
    data: UpdateTalentProfileRequest,
  ): Promise<TalentProfile> => {
    const res = await httpClient.put<TalentProfile>("/profiles/me", data);
    return res.data;
  },

  /**
   * GET /profiles/skills/me
   * Get current user's skills (requires auth)
   */
  getMySkills: async (): Promise<Skill[]> => {
    const res = await httpClient.get<Skill[]>("/profiles/skills/me");
    return res.data;
  },

  /**
   * POST /profiles/skills/me
   * Add a skill to current user's profile (requires auth)
   */
  addSkill: async (data: CreateSkillRequest): Promise<Skill> => {
    const res = await httpClient.post<Skill>("/profiles/skills/me", data);
    return res.data;
  },

  /**
   * DELETE /profiles/skills/me/:id
   * Delete a skill from current user's profile (requires auth)
   */
  deleteSkill: async (
    id: string | number,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.delete<{ success: boolean; message: string }>(
      `/profiles/skills/me/${id}`,
    );
    return res.data;
  },

  /**
   * GET /profiles/languages/me
   * Get current user's languages (requires auth)
   */
  getMyLanguages: async (): Promise<Language[]> => {
    const res = await httpClient.get<Language[]>("/profiles/languages/me");
    return res.data;
  },

  /**
   * POST /profiles/languages/me
   * Add a language to current user's profile (requires auth)
   */
  addLanguage: async (data: CreateLanguageRequest): Promise<Language> => {
    const res = await httpClient.post<Language>("/profiles/languages/me", data);
    return res.data;
  },

  /**
   * DELETE /profiles/languages/me/:id
   * Delete a language from current user's profile (requires auth)
   */
  deleteLanguage: async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const res = await httpClient.delete<{ success: boolean; message: string }>(
      `/profiles/languages/me/${id}`,
    );
    return res.data;
  },

  /**
   * GET /profiles/catalogs
   * Get all catalogs (categories, languages, etc.)
   */
  getCatalogs: async (): Promise<Catalogs> => {
    const res = await httpClient.get<Catalogs>("/profiles/catalogs");
    return res.data;
  },
};
