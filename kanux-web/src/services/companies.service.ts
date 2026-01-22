/**
 * Companies Service
 * Access layer for companies microservice (ms-companies)
 *
 * All requests are proxied through API Gateway at /companies
 */

import { httpClient } from "@/services/http";

// ============================================================================
// Request DTOs
// ============================================================================

export interface RegisterCompanyRequest {
  name: string;
  about: string;
  location: string;
  contact?: Record<string, unknown>;
  url_logo?: string;
  goal?: string;
}

export interface ContactTalentRequest {
  [key: string]: unknown;
}

// ============================================================================
// Response DTOs
// ============================================================================

export interface Company {
  id: string;
  id_user: string;
  name: string;
  about: string;
  location: string;
  contact?: Record<string, unknown>;
  url_logo?: string;
  goal?: string;
  [key: string]: unknown;
}

export interface RegisterCompanyResponse {
  data: Company;
  token: string;
}

export interface TalentSearchResult {
  id: string;
  first_name?: string;
  last_name?: string;
  title?: string;
  location?: string;
  experience_level?: string;
  [key: string]: unknown;
}

export interface TalentSearchResponse {
  data: TalentSearchResult[];
}

export interface CompanyMetrics {
  total_candidates: number;
  active_challenges: number;
  total_conversations: number;
}

export interface CompanyMetricsResponse {
  active_challenges: number;
  candidates_evaluated: number;
  total_conversation: number;
}

export interface ContactResponse {
  data: unknown;
  status: string;
}

// ============================================================================
// Service
// ============================================================================

export const companiesService = {
  /**
   * POST /companies/company/register/:id_user
   * Register a company (multipart form data with optional logo upload)
   */
  registerCompany: async (
    userId: string,
    data: RegisterCompanyRequest,
    logoFile?: File,
  ): Promise<RegisterCompanyResponse> => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("about", data.about);
    formData.append("location", data.location);
    if (data.contact) {
      formData.append("contact", JSON.stringify(data.contact));
    }
    if (data.url_logo) {
      formData.append("url_logo", data.url_logo);
    }
    if (data.goal) {
      formData.append("goal", data.goal);
    }
    if (logoFile) {
      formData.append("logo", logoFile);
    }

    const res = await httpClient.post<RegisterCompanyResponse>(
      `/companies/company/register/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return res.data;
  },

  /**
   * GET /companies/company/talent/search/:querySearch
   * Search for talent
   */
  searchTalent: async (searchQuery: string): Promise<TalentSearchResponse> => {
    const res = await httpClient.get<TalentSearchResult[]>(
      `/companies/company/talent/search/${searchQuery}`,
    );

    return {
      data: res.data,
    };
  },

  /**
   * GET /companies/company/metrics/:id_company
   * Get metrics for a company
   */
  getCompanyMetrics: async (companyId: string): Promise<CompanyMetrics> => {
    const res = await httpClient.get<CompanyMetricsResponse>(
      `/companies/company/metrics/${companyId}`,
    );

    return {
      active_challenges: res.data.active_challenges,
      total_candidates: res.data.candidates_evaluated,
      total_conversations: res.data.total_conversation,
    };
  },

  /**
   * POST /companies/company/contact/:id_company,:id_talent
   * Initiate contact with a talent
   */
  contactWithTalent: async (
    companyId: string,
    talentId: string,
  ): Promise<ContactResponse> => {
    const res = await httpClient.post<ContactResponse>(
      `/companies/company/contact/${companyId}:${talentId}`,
      {},
    );
    return res.data;
  },
};
