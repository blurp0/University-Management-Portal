export interface Faculty {
  id: string;
  userId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  office?: string;
  departmentId: string;
  department?: Department;
  hireDate: Date;
  title?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  headId?: string;
}

export interface CreateFacultyRequest {
  firstName: string;
  lastName: string;
  phone?: string;
  office?: string;
  departmentId: string;
  hireDate: Date;
  title?: string;
}

export interface UpdateFacultyRequest extends Partial<CreateFacultyRequest> {}
