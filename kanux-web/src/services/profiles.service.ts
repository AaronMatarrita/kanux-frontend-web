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
  image_profile?: File;
}

export interface CreateSkillRequest {
  category_id: string;
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
}
export interface UpdateSkillRequest {
  category_id?: string;
  name?: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
}
export interface CreateLanguageRequest {
  language_id: string;
  level: "Básico" | "Intermedio" | "Avanzado";
}

export interface UpdateLenguageRequest{
  language_id: string;
  level: "Básico" | "Intermedio" | "Avanzado";
}
// ============================================================================
// Response DTOs
// ============================================================================
export interface TalentPreregisterResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    user_type: string;
    profile: TalentProfile;
    [key: string]: unknown;
  };
}
export interface TalentProfile {
  id: string;
  user_id: string;
  image_url?: string;
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
    type_category:string;
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

export interface DashboardChallenge {
  id: string;
  title: string;
  description: string | null;
  challenge_type: string;
  difficulty: string;
  duration_minutes: number | null;
  created_by_company: string | null;
  created_at: string;
}

export interface FeedPost {
  id: string;
  content: string;
  created_at: string;
  author: {
    id: string;
    name?: string;
    avatar?: string;
  } | null;
  commentsCount: number;
  reactionsCount: number;
  comments: unknown[];
  reactions: unknown[];
  isOwner: boolean;
  isLikedByMe: boolean;
}

export interface DashboardStats {
  skillsCount: number;
  completedChallengesCount: number;
  unreadMessagesCount: number;
  postsCount: number;
}

// ============================================================================
// Service
// ============================================================================

export const profilesService = {
   /**
   * POST /profiles/me
   * POST user's profile (requires auth)
   */
  preRegisterProfile: async (
    id_user: string,
    data: TalentProfile,
  ): Promise<TalentPreregisterResponse> => {
    const res = await httpClient.post<TalentPreregisterResponse>(
      `/profiles/${id_user}`,
      data,
    );
    return res.data;
  },
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
    const formData = new FormData();

    if (data.first_name) formData.append("first_name", data.first_name);
    if (data.last_name) formData.append("last_name", data.last_name);
    if (data.title) formData.append("title", data.title);
    if (data.location) formData.append("location", data.location);
    if (data.experience_level) formData.append("experience_level", data.experience_level);
    if (data.education) formData.append("education", data.education);
    if (data.about) formData.append("about", data.about);
    if (data.learning_background_id) {formData.append("learning_background_id", data.learning_background_id);}
    if (data.opportunity_status_id) {formData.append("opportunity_status_id", data.opportunity_status_id);}
    if (data.contact) {formData.append("contact", JSON.stringify(data.contact)); }
    if (data.image_profile) { formData.append("image_profile", data.image_profile);}

    const res = await httpClient.put<TalentProfile>("/profiles/me", data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
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
   * PATCH /profiles/skills/me/:id
   */
  updateSkill: async (id: string | number, data: UpdateSkillRequest): Promise<Skill> => {
    // Usamos patch o put según tu backend
    const res = await httpClient.put<Skill>(`/profiles/skills/me/${id}`, data);
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
   * PUT /profiles/languages/me/id
   * Update a language to current user's profile (requires auth)
   */
  updateLanguage:async(id:string,data:UpdateLenguageRequest):Promise<Language>=>{
    const res = await httpClient.post<Language>(`/profiles/languages/me/${id}`, data);
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

  getFirstChallenges: async (): Promise<DashboardChallenge[]> => {
    const res = await httpClient.get<DashboardChallenge[]>(
      "/profiles/dashboard/challenges",
    );
    return res.data;
  },

  getDashboardFeed: async (): Promise<FeedPost[]> => {
    const res = await httpClient.get<FeedPost[]>("/profiles/dashboard/feed");

    return res.data;
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await httpClient.get<DashboardStats>(
      "/profiles/dashboard/stats",
    );

    return res.data;
  },
};
