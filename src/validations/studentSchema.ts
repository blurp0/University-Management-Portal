import { z } from "zod";
import type { Gender } from "@/types/student";

export const studentSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  middleName: z.string().optional(),
  gender: z.string() as z.ZodType<Gender>,
  dateOfBirth: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().default("US"),
  departmentId: z.string().min(1, "Department is required"),
  enrollmentYear: z.number().min(2000).max(2030),
});

export type StudentFormData = z.infer<typeof studentSchema>;
