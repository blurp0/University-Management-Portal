export const Gender = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  headId?: string;
}

export interface Student {
  id: string;
  userId: string;
  studentId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  departmentId: string;
  department?: Department;
  enrollmentYear: number;
  gpa?: number;
  creditsEarned?: number;
  status?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  gender?: Gender;
  dateOfBirth?: Date;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  departmentId: string;
  enrollmentYear: number;
}

export type UpdateStudentRequest = Partial<CreateStudentRequest>;
