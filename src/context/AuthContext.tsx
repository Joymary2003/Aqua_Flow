import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

type User = {
  id: string;
  email: string;
  name: string | null;
  dailyGoal: number;
};

type AuthContextType = {
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Optionally fetch /api/user/me if you want to restore session on reload,
    // or just rely on local storage for now
    const storedUser = localStorage.getItem("aquaflow_user");
    const token = localStorage.getItem("aquaflow_token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem("aquaflow_token", token);
    localStorage.setItem("aquaflow_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("aquaflow_token");
    localStorage.removeItem("aquaflow_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
