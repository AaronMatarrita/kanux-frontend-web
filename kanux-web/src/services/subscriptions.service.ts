/**
 * Subscriptions Service
 * Access layer for subscriptions microservice (ms-subscriptions)
 *
 * All requests are proxied through API Gateway at /subscriptions
 */

import { httpClient } from "@/services/http";

// ============================================================================
// Request DTOs
// ============================================================================

export interface CreateCompanyPlanRequest {
  name: string;
  description?: string | null;
  price_monthly: number;
  features: {
    max_profile_views_per_month?: number;
    can_contact_talent?: boolean;
    can_use_advanced_filters?: boolean;
    can_create_custom_challenges?: boolean;
    can_access_metrics?: boolean;
    can_access_reports?: boolean;
  };
}

export interface CreateTalentPlanRequest {
  name: string;
  description?: string | null;
  price_monthly: number;
  features: {
    can_access_basic_challenges?: boolean;
    can_access_advanced_challenges?: boolean;
    can_access_detailed_reports?: boolean;
  };
}

export interface CreateCompanySubscriptionRequest {
  status?: string;
  end_date?: string;
}

export interface CreateTalentSubscriptionRequest {
  status?: string;
  start_date?: string;
  end_date?: string;
}

// ============================================================================
// Response DTOs
// ============================================================================

export interface CompanyPlanFeatures {
  id?: string;
  max_profile_views_per_month?: number;
  can_contact_talent?: boolean;
  can_use_advanced_filters?: boolean;
  can_create_custom_challenges?: boolean;
  can_access_metrics?: boolean;
  can_access_reports?: boolean;
}

export interface TalentPlanFeatures {
  id?: string;
  can_access_basic_challenges?: boolean;
  can_access_advanced_challenges?: boolean;
  can_access_detailed_reports?: boolean;
}

export interface CompanyPlan {
  id: string;
  name: string;
  description?: string | null;
  price_monthly: number;
  company_plan_features: CompanyPlanFeatures[];
}

export interface TalentPlan {
  id: string;
  name: string;
  description?: string | null;
  price_monthly: number;
  talent_plan_features: TalentPlanFeatures[];
}

export interface CompanySubscription {
  id: string;
  company_id: string;
  plan_id: string;
  status: string;
  end_date?: string;

}

export interface TalentSubscription {
  id: string;
  id_profile: string;
  plan_id: string;
  status: string;
  start_date?: string;
  end_date?: string;
}

export interface ValidationResponse {
  allowed: boolean;
  reason: string;
}

export interface UsageResponse {
  count?: number;
  [key: string]: unknown;
}
//talent current subscription response
export interface TalentPlanDetail {
  id: string;
  name: string;
  description: string | null;
  price_monthly: string;
  created_at: string;
  talent_plan_features:TalentPlanFeatures
}

export interface TalentSubscriptionResponse {
  id: string;
  id_profile: string;
  plan_id: string;
  status: "active" | "inactive" | "pending" | "expired";
  end_date: string;
  talent_plans: TalentPlanDetail;
}

// Wrapper
export interface SubscriptionDataWrapper {
  data: TalentSubscriptionResponse;
  succes: boolean;
}

// ----------SUBSCRIPTION RESPONSE---------------
// ---feature usage ---
export interface CompanyPlanFeatures {
  id?: string;
  max_profile_views_per_month?: number;
  can_contact_talent?: boolean;
  can_use_advanced_filters?: boolean;
  can_create_custom_challenges?: boolean;
  can_access_metrics?: boolean;
  can_access_reports?: boolean;
}

export interface CompanyPlanUsage {
  id: string;
  company_id: string;
  profile_views_used: number;
  challenges_created: number;
  period_start: string;
  period_end: string;
}

// --- detail plan---
export interface CompanyPlanDetail {
  id: string;
  name: string;
  description: string | null;
  price_monthly: string; 
  company_plan_features: CompanyPlanFeatures[];
}

// --- response ---
export interface CompanySubscriptionResponse {
  id: string;
  company_id: string;
  plan_id: string;
  status: "active" | "inactive" | "pending" | "expired";
  start_date: string;
  end_date: string;
  company_plans: CompanyPlanDetail;
  usage: CompanyPlanUsage | null;
}

// wraper
export interface CompanySubscriptionWrapper {
  success: boolean;
  data: CompanySubscriptionResponse;
}
// ============================================================================
// Service
// ============================================================================

export const subscriptionsService = {
  // ==================== PLANS ====================

  /**
   * GET /subscriptions/plans/company
   */
  getAllCompanyPlans: async (): Promise<CompanyPlan[]> => {
    const res = await httpClient.get<CompanyPlan[]>(
      "/subscriptions/plans/company",
    );
    return res.data;
  },

  /**
   * GET /subscriptions/plans/talent
   */
  getAllTalentPlans: async (): Promise<TalentPlan[]> => {
    const res = await httpClient.get<TalentPlan[]>(
      "/subscriptions/plans/talent",
    );
    return res.data;
  },

  /**
   * POST /subscriptions/plans/company
   */
  createCompanyPlan: async (
    data: CreateCompanyPlanRequest,
  ): Promise<CompanyPlan> => {
    const res = await httpClient.post<CompanyPlan>(
      "/subscriptions/plans/company",
      data,
    );
    return res.data;
  },

  /**
   * POST /subscriptions/plans/talent
   */
  createTalentPlan: async (
    data: CreateTalentPlanRequest,
  ): Promise<TalentPlan> => {
    const res = await httpClient.post<TalentPlan>(
      "/subscriptions/plans/talent",
      data,
    );
    return res.data;
  },

  // ==================== SUBSCRIPTIONS ====================

  /**
   * POST /subscriptions/talent/plan/:id_plan
   */
  subscribeTalent: async (
    planId: string,
    data: CreateTalentSubscriptionRequest = {},
  ): Promise<TalentSubscription> => {
    const res = await httpClient.post<TalentSubscription>(
      `/subscriptions/talent/plan/${planId}`,
      data,
    );
    return res.data;
  },

  /**
   * POST /subscriptions/company/plan/:id_plan
   */
  subscribeCompany: async (
    planId: string,
    data: CreateCompanySubscriptionRequest = {},
  ): Promise<CompanySubscription> => {
    const res = await httpClient.post<CompanySubscription>(
      `/subscriptions/company/plan/${planId}`,
      data,
    );
    return res.data;
  },

  /**
   * GET /subscriptions/company/:id_company/validate?action=VIEW_PROFILE
   */
  validateCompanyAction: async (
    companyId: string,
    action: string,
  ): Promise<ValidationResponse> => {
    const res = await httpClient.get<ValidationResponse>(
      `/subscriptions/company/${companyId}/validate`,
      {
        params: { action },
      },
    );
    return res.data;
  },

  /**
   * PATCH /subscriptions/company/:id_company/usage/profile-view
   */
  incrementProfileView: async (companyId: string): Promise<UsageResponse> => {
    const res = await httpClient.patch<UsageResponse>(
      `/subscriptions/company/${companyId}/usage/profile-view`,
      {},
    );
    return res.data;
  },

  /**
   * PATCH /subscriptions/company/:id_company/usage/challenge
   */
  incrementChallenge: async (companyId: string): Promise<UsageResponse> => {
    const res = await httpClient.patch<UsageResponse>(
      `/subscriptions/company/${companyId}/usage/challenge`,
      {},
    );
    return res.data;
  },

  /**
   * GET /subscriptions/company/my-subscription
   */
  getCompanySubscription: async (): Promise<CompanySubscriptionResponse> => {
    const res = await httpClient.get<CompanySubscriptionWrapper>(
      `/subscriptions/company/my-subscription`
    );
    return res.data.data;
  },

  /**
   * GET /subscriptions/talent/my-subscription
   */
  getTalentSubscription: async (): Promise<TalentSubscriptionResponse> => {
    const res = await httpClient.get<SubscriptionDataWrapper>(
      `/subscriptions/talent/my-subscription`
    );
    return res.data.data;
  },

  /**
   * PUT /subscriptions/company/upgrade/:id_plan
   */
  upgradeCompanyPlan: async (
    planId: string,
    data: CreateCompanySubscriptionRequest = {}
  ): Promise<CompanySubscription> => {
    const res = await httpClient.put<CompanySubscription>(
      `/subscriptions/company/upgrade/${planId}`,
      data
    );
    return res.data;
  },

  /**
   * PUT /subscriptions/talent/upgrade/:id_plan
   */
  upgradeTalentPlan: async (
    planId: string,
    data: CreateTalentSubscriptionRequest = {}
  ): Promise<TalentSubscription> => {
    const res = await httpClient.put<TalentSubscription>(
      `/subscriptions/talent/upgrade/${planId}`,
      data
    );
    return res.data;
  },

};
