export const PaymentType = {
  TUITION: "TUITION",
  FEES: "FEES",
  HOUSING: "HOUSING",
  OTHER: "OTHER",
} as const;

export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType];

export const PaymentStatus = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  currency: string;
  type: PaymentType;
  status: PaymentStatus;
  description?: string;
  reference?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentRequest {
  amount: number;
  currency?: string;
  type: PaymentType;
  description?: string;
}

export interface FinancialAid {
  id: string;
  studentId: string;
  type: string;
  amount: number;
  status: string;
  academicYear: string;
  semester: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFinancialAidRequest {
  type: string;
  amount: number;
  academicYear: string;
  semester: string;
  startDate: Date;
  endDate?: Date;
  notes?: string;
}
