/**
 * Auth Service
 * Access layer for authentication microservice (ms-auth)
 *
 * All requests are proxied through API Gateway at /auth
 */

import { httpClient } from "@/services/http";

// ============================================================================
// Request DTOs
// ============================================================================

export interface PreRegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  userType: "talent" | "company";
}

export interface LoginRequest {
  email: string;
  password: string;
}

// ============================================================================
// Response DTOs
// ============================================================================

export interface PreRegisterResponse {
  success: boolean;
  user: string; // user ID
  nextStep: "REGISTER_TALENT" | "REGISTER_COMPANY";
}

export interface UserProfile {
  id?: string;
  [key: string]: unknown;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    userType: "talent" | "company";
    profile: UserProfile;
  };
}

// ============================================================================
// Service
// ============================================================================

export const authService = {
  /**
   * POST /auth/pre-register
   * Register a new user (talent or company)
   */
  preRegister: async (
    data: PreRegisterRequest,
  ): Promise<PreRegisterResponse> => {
    const res = await httpClient.post<PreRegisterResponse>(
      "/auth/pre-register",
      data,
    );
    return res.data;
  },

  /**
   * POST /auth/login
   * Authenticate user and return JWT token
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await httpClient.post<LoginResponse>("/auth/login", data);
    return res.data;
  },
};
