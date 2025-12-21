import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { authService } from "@/services/authService";
import { UserRole } from "@acentra/shared-types";

import { ActionPermission, ROLE_PERMISSIONS } from "@acentra/shared-types";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  profile_picture?: string;
  department?: string;
  office_location?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  permissions: ActionPermission[];
  hasPermission: (permission: ActionPermission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
  onLoginSuccess?: (user: User) => void;
  onLogout?: () => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  onLoginSuccess,
  onLogout,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });

    const { token: newToken, user: newUser } = response.data;

    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);

    if (onLoginSuccess) {
      onLoginSuccess(newUser);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);

    if (onLogout) {
      onLogout();
    }
  };

  const permissions = user
    ? ROLE_PERMISSIONS[user.role] || ROLE_PERMISSIONS[user.role.toLowerCase() as UserRole] || []
    : [];

  const hasPermission = (permission: ActionPermission) => {
    if (!user) return false;
    // Check for super admin (case-insensitive)
    if (user.role === UserRole.SUPER_ADMIN || user.role.toLowerCase() === UserRole.SUPER_ADMIN) return true;
    return permissions.includes(permission);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    loading,
    permissions,
    hasPermission,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
