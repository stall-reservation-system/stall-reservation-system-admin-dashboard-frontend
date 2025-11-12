export type UserRole = "admin" | "user" | "vendor";

export interface User {
  userId: number;
  name: string;
  email: string;
  contactNumber: string;
  role: UserRole;
  createdAt?: string | null;
  genres?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
