import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContextType, User, LoginResponse } from "@/types/auth";
import { ApiService } from "@/services/api";
import { setMockAuthenticatedUser } from "@/mocks/fetchMock";
import { toast } from "sonner";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_TOKEN = "auth_token";
const STORAGE_KEY_USER = "auth_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load stored auth data on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEY_USER);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to restore auth state:", error);
        localStorage.removeItem(STORAGE_KEY_TOKEN);
        localStorage.removeItem(STORAGE_KEY_USER);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await ApiService.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      // Check if user is admin
      if (data.user.role !== "admin") {
        toast.error(
          `Access Denied: Only administrators can access this platform. Your role is: ${data.user.role}`
        );
        throw new Error("Only admins can access this platform");
      }

      // Store auth data
      localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(data.user));

      // Update mock with authenticated user
      try {
        setMockAuthenticatedUser(data.user);
      } catch (e) {
        // Mock not available (production build)
      }

      setToken(data.token);
      setUser(data.user);

      toast.success(`Welcome back, ${data.user.name}!`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);

    // Clear mock authenticated user
    try {
      setMockAuthenticatedUser(null);
    } catch (e) {
      // Mock not available (production build)
    }

    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
