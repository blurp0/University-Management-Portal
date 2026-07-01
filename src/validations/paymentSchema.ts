import { z } from "zod";
import type { PaymentType } from "@/types/payment";

export const paymentSchema = z.object({
  amount: z.number().positive("Amount must be positive"),
  currency: z.string().default("USD"),
  type: z.string() as z.ZodType<PaymentType>,
  description: z.string().optional(),
});

export const financialAidSchema = z.object({
  type: z.string().min(1, "Aid type is required"),
  amount: z.number().positive("Amount must be positive"),
  academicYear: z.string().min(1, "Academic year is required"),
  semester: z.string().min(1, "Semester is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  notes: z.string().optional(),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
export type FinancialAidFormData = z.infer<typeof financialAidSchema>;
