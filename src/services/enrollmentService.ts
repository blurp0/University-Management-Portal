import api from "@/lib/api";

interface PaginatedResponse<T> {
  enrollments: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface Enrollment {
  id: string;
  studentId: string;
  sectionId: string;
  status: string;
  enrolledAt: string;
  droppedAt?: string;
  section?: {
    id: string;
    sectionNumber: string;
    semester: string;
    year: number;
    room?: string;
    schedule?: string;
    course?: { id: string; name: string; code: string; credits: number };
    faculty?: { id: string; firstName: string; lastName: string };
  };
}

export const enrollmentService = {
  getAll: async (page = 1, limit = 10, search?: string): Promise<PaginatedResponse<Enrollment>> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (search) params.append("search", search);
    const response = await api.get<ApiResponse<PaginatedResponse<Enrollment>>>(`/api/enrollments?${params}`);
    return response.data.data;
  },

  enroll: async (sectionId: string): Promise<Enrollment> => {
    const response = await api.post<ApiResponse<Enrollment>>("/api/enrollments", { sectionId });
    return response.data.data;
  },

  drop: async (id: string): Promise<Enrollment> => {
    const response = await api.delete<ApiResponse<Enrollment>>(`/api/enrollments/${id}`);
    return response.data.data;
  },
};
