export const Semester = {
  FALL: "FALL",
  SPRING: "SPRING",
  SUMMER: "SUMMER",
} as const;

export type Semester = (typeof Semester)[keyof typeof Semester];

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  headId?: string;
}

export interface Faculty {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  credits: number;
  departmentId: string;
  department?: Department;
  prerequisites: string[];
  isActive: boolean;
  sections?: Section[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Section {
  id: string;
  courseId: string;
  course?: Course;
  facultyId?: string;
  faculty?: Faculty;
  semester: Semester;
  year: number;
  sectionNumber: string;
  capacity: number;
  enrolled: number;
  room?: string;
  schedule?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCourseRequest {
  name: string;
  code: string;
  description?: string;
  credits: number;
  departmentId: string;
  prerequisites?: string[];
}

export type UpdateCourseRequest = Partial<CreateCourseRequest>;

export interface CreateSectionRequest {
  courseId: string;
  facultyId?: string;
  semester: Semester;
  year: number;
  sectionNumber: string;
  capacity: number;
  room?: string;
  schedule?: string;
}

export type UpdateSectionRequest = Partial<CreateSectionRequest>;
