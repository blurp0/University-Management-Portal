import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { enrollmentService } from "@/services/enrollmentService";
import { toast } from "sonner";

export const useEnrollments = (page = 1, limit = 10, search?: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["enrollments", page, limit, search],
    queryFn: () => enrollmentService.getAll(page, limit, search),
    staleTime: 5 * 60 * 1000,
  });

  const enrollMutation = useMutation({
    mutationFn: (sectionId: string) => enrollmentService.enroll(sectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      toast.success("Enrolled successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to enroll");
    },
  });

  const dropMutation = useMutation({
    mutationFn: (id: string) => enrollmentService.drop(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      toast.success("Dropped successfully!");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to drop enrollment");
    },
  });

  return {
    enrollments: data?.enrollments || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    error,
    enroll: enrollMutation.mutate,
    drop: dropMutation.mutate,
    isEnrolling: enrollMutation.isPending,
    isDropping: dropMutation.isPending,
  };
};
