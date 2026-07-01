import api from "@/lib/api";
import type { User, LoginRequest, RegisterRequest, AuthResponse } from "@/types/user";

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/register", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<User>("/auth/me");
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/auth/refresh", {
      refreshToken,
    });
    return response.data;
  },

  getGoogleAuthUrl: (): string => {
    return `${api.defaults.baseURL}/auth/google`;
  },

  getGithubAuthUrl: (): string => {
    return `${api.defaults.baseURL}/auth/github`;
  },
};
