import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStudents } from "@/hooks/useStudents";
import { StudentTable } from "@/components/students/StudentTable";
import { StudentForm } from "@/components/students/StudentForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Users, GraduationCap, Activity } from "lucide-react";
import type { Student } from "@/types/student";
import type { StudentFormData } from "@/validations/studentSchema";

export function StudentListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const {
    students,
    total,
    totalPages,
    isLoading,
    createStudent,
    updateStudent,
    deleteStudent,
    isCreating,
    isUpdating,
  } = useStudents(page, 10, debouncedSearch);

  const activeCount = students.filter((s) => s.status === "ACTIVE").length;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const handleSearchChange = (value: string) => setSearch(value);
  const handleAdd = () => { setSelectedStudent(null); setDialogOpen(true); };
  const handleEdit = (student: Student) => { setSelectedStudent(student); setDialogOpen(true); };
  const handleDelete = (student: Student) => {
    if (window.confirm(`Delete ${student.firstName} ${student.lastName}?`)) deleteStudent(student.id);
  };
  const handleView = (student: Student) => navigate(`/students/${student.id}`);

  const handleFormSubmit = (data: StudentFormData) => {
    const formatted = { ...data, dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined };
    if (selectedStudent) updateStudent({ id: selectedStudent.id, data: formatted });
    else createStudent(formatted);
    setDialogOpen(false);
    setSelectedStudent(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedStudent(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">Manage student records and academic information</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Students</p>
              <p className="text-xl font-bold">{total}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
              <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-xl font-bold">{activeCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
              <GraduationCap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current Page</p>
              <p className="text-xl font-bold">{students.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <StudentTable
        students={students}
        total={total}
        totalPages={totalPages}
        page={page}
        isLoading={isLoading}
        search={search}
        onSearchChange={handleSearchChange}
        onPageChange={setPage}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <StudentForm
            student={selectedStudent ?? undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleDialogClose}
            isSubmitting={isCreating || isUpdating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
