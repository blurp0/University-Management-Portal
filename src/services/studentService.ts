import api from "@/lib/api";
import type { Student, CreateStudentRequest, UpdateStudentRequest } from "@/types/student";

interface PaginatedResponse<T> {
  students: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const studentService = {
  getAll: async (page = 1, limit = 10, search?: string): Promise<PaginatedResponse<Student>> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (search) params.append("search", search);
    const response = await api.get<ApiResponse<PaginatedResponse<Student>>>(`/api/students?${params}`);
    return response.data.data;
  },

  getById: async (id: string): Promise<Student> => {
    const response = await api.get<ApiResponse<Student>>(`/api/students/${id}`);
    return response.data.data;
  },

  create: async (data: CreateStudentRequest): Promise<Student> => {
    const response = await api.post<ApiResponse<Student>>("/api/students", data);
    return response.data.data;
  },

  update: async (id: string, data: UpdateStudentRequest): Promise<Student> => {
    const response = await api.put<ApiResponse<Student>>(`/api/students/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/students/${id}`);
  },

  getGrades: async (id: string): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>(`/api/students/${id}/grades`);
    return response.data.data;
  },

  getEnrollments: async (id: string): Promise<any[]> => {
    const response = await api.get<ApiResponse<any[]>>(`/api/students/${id}/enrollments`);
    return response.data.data;
  },
};
