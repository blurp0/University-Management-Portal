import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Loader2, GraduationCap, Mail, Phone, MapPin } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnrollmentTable } from "@/components/enrollments/EnrollmentTable";
import { useStudent } from "@/hooks/useStudents";
import type { Student } from "@/types/student";

interface Grade {
  id: string;
  grade: string;
  gpa: number;
  comments?: string;
  section: {
    sectionNumber: string;
    semester: string;
    year: number;
    course: {
      code: string;
      name: string;
      credits: number;
    };
  };
}

interface StudentWithRelations extends Student {
  enrollments: Array<{
    id: string;
    status: string;
    enrolledAt: string;
    section: {
      sectionNumber: string;
      semester: string;
      year: number;
      room?: string;
      schedule?: string;
      course: { name: string; code: string; credits: number };
      faculty?: { firstName: string; lastName: string };
    };
  }>;
  grades: Grade[];
}

const GRADE_COLORS: Record<string, string> = {
  A: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-400/20",
  "A-": "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-400/20",
  "B+": "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-400/20",
  B: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-400/20",
  "B-": "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-400/20",
  "C+": "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-400/20",
  C: "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-400/20",
  "C-": "bg-amber-50 text-amber-700 ring-1 ring-amber-600/20 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-400/20",
  "D+": "bg-orange-50 text-orange-700 ring-1 ring-orange-600/20 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-400/20",
  D: "bg-orange-50 text-orange-700 ring-1 ring-orange-600/20 dark:bg-orange-500/10 dark:text-orange-400 dark:ring-orange-400/20",
  F: "bg-red-50 text-red-700 ring-1 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-400/20",
};

function getGradeClass(grade: string) {
  return GRADE_COLORS[grade] ?? "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20";
}

export function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { student, isLoading, error } = useStudent(id!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p className="text-muted-foreground">Student not found.</p>
        <Button variant="outline" onClick={() => navigate("/students")}>
          Back to Students
        </Button>
      </div>
    );
  }

  const studentDetail = student as StudentWithRelations;
  const fullName = [studentDetail.firstName, studentDetail.middleName, studentDetail.lastName].filter(Boolean).join(" ");
  const initials = [studentDetail.firstName?.[0], studentDetail.lastName?.[0]].filter(Boolean).join("").toUpperCase();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/students")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-4 flex-1">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{fullName}</h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{studentDetail.studentId}</span>
              <span className="text-muted-foreground/40">|</span>
              <span>{studentDetail.department?.name ?? "N/A"}</span>
              <span className="text-muted-foreground/40">|</span>
              {studentDetail.gpa != null && (
                <span className="inline-flex items-center gap-1">
                  <GraduationCap className="h-3.5 w-3.5" />
                  GPA: <strong className={
                    studentDetail.gpa >= 3.5 ? "text-emerald-600" :
                    studentDetail.gpa >= 2.5 ? "text-blue-600" :
                    studentDetail.gpa >= 2 ? "text-amber-600" : "text-red-600"
                  }>{studentDetail.gpa.toFixed(2)}</strong>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Personal Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Gender</p>
                  <p className="text-sm font-medium">{studentDetail.gender ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date of Birth</p>
                  <p className="text-sm font-medium">
                    {studentDetail.dateOfBirth ? format(new Date(studentDetail.dateOfBirth), "MMM d, yyyy") : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    {studentDetail.phone ?? "-"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="text-sm font-medium flex items-start gap-1.5">
                    <MapPin className="h-3 w-3 text-muted-foreground mt-0.5 shrink-0" />
                    <span>
                      {[studentDetail.address, studentDetail.city, studentDetail.state, studentDetail.zipCode, studentDetail.country].filter(Boolean).join(", ") || "-"}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Academic</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium">{studentDetail.department?.name ?? "-"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Enrollment Year</p>
                  <p className="text-sm font-medium">{studentDetail.enrollmentYear}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge variant={studentDetail.status === "ACTIVE" ? "default" : "secondary"} className="mt-0.5">
                    {studentDetail.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Credits Earned</p>
                  <p className="text-sm font-medium">{studentDetail.creditsEarned ?? 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="enrollments">
          <EnrollmentTable
            enrollments={studentDetail.enrollments ?? []}
            isLoading={isLoading}
            onDrop={(enrollmentId) => {
              console.log("Drop enrollment:", enrollmentId);
            }}
            isDropping={false}
          />
        </TabsContent>

        <TabsContent value="grades">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Grades</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {studentDetail.grades?.length ?? 0} grade{studentDetail.grades?.length !== 1 ? "s" : ""} recorded
                </p>
              </div>
              {studentDetail.gpa != null && (
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Cumulative GPA</p>
                  <p className={`text-2xl font-bold ${
                    (studentDetail.gpa as number) >= 3.5 ? "text-emerald-600" :
                    (studentDetail.gpa as number) >= 2.5 ? "text-blue-600" :
                    (studentDetail.gpa as number) >= 2 ? "text-amber-600" : "text-red-600"
                  }`}>
                    {studentDetail.gpa.toFixed(2)}
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {studentDetail.grades && studentDetail.grades.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Code</TableHead>
                      <TableHead>Course Name</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Section</TableHead>
                      <TableHead className="text-center">Grade</TableHead>
                      <TableHead className="text-center">GPA</TableHead>
                      <TableHead>Comments</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentDetail.grades.map((grade) => (
                      <TableRow key={grade.id}>
                        <TableCell className="font-medium">{grade.section.course.code}</TableCell>
                        <TableCell>{grade.section.course.name}</TableCell>
                        <TableCell>{grade.section.course.credits}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">Sec {grade.section.sectionNumber}</TableCell>
                        <TableCell className="text-center">
                          <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold ${getGradeClass(grade.grade)}`}>
                            {grade.grade}
                          </span>
                        </TableCell>
                        <TableCell className="text-center font-medium">{grade.gpa.toFixed(2)}</TableCell>
                        <TableCell className="text-muted-foreground text-sm max-w-[200px] truncate">
                          {grade.comments || "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <GraduationCap className="h-12 w-12 text-muted-foreground/40 mb-4" />
                  <p className="font-medium text-muted-foreground">No grades found</p>
                  <p className="text-sm text-muted-foreground/60 mt-1">
                    Grades will be available once assessments are recorded
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
