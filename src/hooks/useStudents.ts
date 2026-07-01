import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentService } from "@/services/studentService";
import type { CreateStudentRequest, UpdateStudentRequest } from "@/types/student";
import { toast } from "sonner";

export const useStudents = (page = 1, limit = 10, search?: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["students", page, limit, search],
    queryFn: () => studentService.getAll(page, limit, search),
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateStudentRequest) => studentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student created successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create student");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentRequest }) =>
      studentService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to update student");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => studentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student deleted successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete student");
    },
  });

  return {
    students: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
    createStudent: createMutation.mutate,
    updateStudent: updateMutation.mutate,
    deleteStudent: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useStudent = (id: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["students", id],
    queryFn: () => studentService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  return {
    student: data,
    isLoading,
    error,
  };
};
