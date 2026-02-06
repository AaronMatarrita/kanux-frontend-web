

import { httpClient } from "@/services/http";
import { getDeviceId } from "@/lib/device";


export type PlanFeatures = {
  plan: {
    id: string | null;
    name: string | null;
    price_monthly: number | null;
  };
  features: {
    can_contact_talent?: boolean;
    can_use_advanced_filters?: boolean;
    can_create_custom_challenges?: boolean;
    can_access_metrics?: boolean;
    can_access_reports?: boolean;

    can_access_basic_challenges?: boolean;
    can_access_advanced_challenges?: boolean;
    can_access_detailed_reports?: boolean;
  };
};


export interface PreRegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  userType: "talent" | "company";
  deviceId?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  deviceId?: string;
}


export interface PreRegisterResponse {
  success: boolean;
  user: string; 
  token: string;
  sessionId: string;
  nextStep: "REGISTER_TALENT" | "REGISTER_COMPANY";
}

export interface UserProfile {
  id?: string;
  [key: string]: unknown;
}

import {
  BackendTalentProfile,
  BackendCompanyProfile,
} from "@/modules/auth/login/types";

export type LoginResponse =
  | {
      token: string;
      sessionId: string;
      plan: PlanFeatures | null;
      user: {
        id: string;
        email: string;
        userType: "talent";
        profile: BackendTalentProfile;
      };
    }
  | {
      token: string;
      sessionId: string;
      plan: PlanFeatures | null;
      user: {
        id: string;
        email: string;
        userType: "company";
        profile: BackendCompanyProfile;
      };
    };



export const authService = {
 
  preRegister: async (
    data: PreRegisterRequest,
  ): Promise<PreRegisterResponse> => {
    const deviceId = getDeviceId();
    const res = await httpClient.post<PreRegisterResponse>(
      "/auth/pre-register",
      { ...data, deviceId },
    );
    return res.data;
  },

 
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const deviceId = getDeviceId();
    const res = await httpClient.post<LoginResponse>("/auth/login", {
      ...data,
      deviceId,
    });
    return res.data;
  },
};
