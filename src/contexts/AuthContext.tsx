import React, { createContext, useContext, useState, useEffect } from "react";
import { isTokenValid } from "../utils/jwt.utils";
import type { AuthUser } from "../services/auth.service";

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const loadStoredUser = (): AuthUser | null => {
  try {
    const stored = localStorage.getItem("user");
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    const stored = localStorage.getItem("token");
    return isTokenValid(stored) ? stored : null;
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedToken = localStorage.getItem("token");
    return isTokenValid(storedToken) ? loadStoredUser() : null;
  });

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const login = (newToken: string, newUser: AuthUser) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  // Auto-logout khi token hết hạn giữa session
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      if (!isTokenValid(token)) logout();
    }, 30_000); // kiểm tra mỗi 30 giây

    return () => clearInterval(interval);
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role: user?.role ?? null,
        isAuthenticated: isTokenValid(token),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
