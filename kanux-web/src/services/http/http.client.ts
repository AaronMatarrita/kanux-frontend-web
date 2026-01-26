import axios, { AxiosError, AxiosInstance } from "axios";
import { handleHttpError } from "@/services/http/http.errors";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const httpClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Request Interceptor
 * Adds JWT token to headers if available.
 */

httpClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const sessionData = localStorage.getItem("session");
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData);
          if (session?.token) {
            config.headers.Authorization = `Bearer ${session.token}`;
          }
        } catch (error) {
          console.error("Error parsing session data:", error);
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Response Interceptor
 * Centralized error handling.
 */
httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    handleHttpError(error);
    return Promise.reject(error);
  },
);
