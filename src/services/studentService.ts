import api from "@/lib/api";
import type { Student, CreateStudentRequest, UpdateStudentRequest } from "@/types/student";

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const studentService = {
  getAll: async (page = 1, limit = 10, search?: string): Promise<PaginatedResponse<Student>> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (search) params.append("search", search);
    const response = await api.get<PaginatedResponse<Student>>(`/api/students?${params}`);
    return response.data;
  },

  getById: async (id: string): Promise<Student> => {
    const response = await api.get<Student>(`/api/students/${id}`);
    return response.data;
  },

  create: async (data: CreateStudentRequest): Promise<Student> => {
    const response = await api.post<Student>("/api/students", data);
    return response.data;
  },

  update: async (id: string, data: UpdateStudentRequest): Promise<Student> => {
    const response = await api.put<Student>(`/api/students/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/students/${id}`);
  },

  getGrades: async (id: string): Promise<any[]> => {
    const response = await api.get(`/api/students/${id}/grades`);
    return response.data;
  },

  getEnrollments: async (id: string): Promise<any[]> => {
    const response = await api.get(`/api/students/${id}/enrollments`);
    return response.data;
  },
};
