"use client";
import { createContext, useContext, useState } from "react";
import type { Session } from "@/types/session.types";

type AuthContextType = {
  session: Session | null;
  login: (session: Session) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(() => {
    if (typeof window === "undefined") return null;

    const stored = localStorage.getItem("session");
    return stored ? JSON.parse(stored) : null;
  });

  const [loading] = useState(false);

  const login = async (sessionData: Session) => {
    console.log("Storing session data:", sessionData);
    localStorage.setItem("session", JSON.stringify(sessionData));
    setSession(sessionData);
    console.log("Session state updated:");
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
