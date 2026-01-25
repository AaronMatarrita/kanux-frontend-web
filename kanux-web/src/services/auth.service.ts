

import { httpClient } from "@/services/http";
import { getDeviceId } from "@/lib/device";


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
