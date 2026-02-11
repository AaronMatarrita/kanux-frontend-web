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
        } catch {}
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

httpClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("session");
      document.cookie = "token=; path=/; max-age=0";

      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }

    handleHttpError(error);
    return Promise.reject(error);
  },
);
