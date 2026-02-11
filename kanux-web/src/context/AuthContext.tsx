"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session } from "@/types/session.types";

type AuthContextType = {
  session: Session | null;
  login: (session: Session) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("session");

    if (!stored) {
      setLoading(false);
      return;
    }

    try {
      const parsed: Session = JSON.parse(stored);

      setSession((prev) =>
        prev?.sessionId === parsed.sessionId ? prev : parsed
      );
    } catch (error) {
      console.error("Invalid session in localStorage", error);
      localStorage.removeItem("session");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (sessionData: Session) => {
    localStorage.setItem("session", JSON.stringify(sessionData));
    setSession(sessionData);
  };

  const logout = async () => {
    localStorage.removeItem("session");
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
