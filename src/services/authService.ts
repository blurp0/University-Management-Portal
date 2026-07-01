import api from "@/lib/api";
import type { User, LoginRequest, RegisterRequest, AuthResponse } from "@/types/user";

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<{ data: AuthResponse }>("/auth/login", data);
    return response.data.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<{ data: AuthResponse }>("/auth/register", data);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<{ data: User }>("/auth/me");
    return response.data.data;
  },

  refreshToken: async (): Promise<{ accessToken: string }> => {
    const response = await api.post<{ data: { accessToken: string } }>("/auth/refresh");
    return response.data.data;
  },
};
