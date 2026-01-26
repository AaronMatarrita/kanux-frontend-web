

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
  token: string;
  sessionId: string;
  nextStep: "REGISTER_TALENT" | "REGISTER_COMPANY";
}

export interface UserProfile {
  id?: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  token: string;
  sessionId: string;
  user: {
    id: string;
    email: string;
    userType: "talent" | "company";
    profile: UserProfile;
  };
}


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
