import { z } from "zod";
import type { Semester } from "@/types/course";

export const courseSchema = z.object({
  name: z.string().min(2, "Course name must be at least 2 characters"),
  code: z.string().min(2, "Course code is required"),
  description: z.string().optional(),
  credits: z.number().min(1).max(6),
  departmentId: z.string().min(1, "Department is required"),
  prerequisites: z.array(z.string()).optional(),
});

export const sectionSchema = z.object({
  courseId: z.string().min(1, "Course is required"),
  facultyId: z.string().optional(),
  semester: z.string() as z.ZodType<Semester>,
  year: z.number().min(2000).max(2030),
  sectionNumber: z.string().min(1, "Section number is required"),
  capacity: z.number().min(1),
  room: z.string().optional(),
  schedule: z.string().optional(),
});

export type CourseFormData = z.infer<typeof courseSchema>;
export type SectionFormData = z.infer<typeof sectionSchema>;
