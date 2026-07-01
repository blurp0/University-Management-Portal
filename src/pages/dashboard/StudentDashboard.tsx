import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap, BookOpen, Clock, Award, Loader2,
  ChevronRight, Calendar
} from "lucide-react";
import { Link } from "react-router-dom";

const GRADE_COLORS: Record<string, string> = {
  A: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10",
  "A-": "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10",
  "B+": "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10",
  B: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10",
  "B-": "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-500/10",
  "C+": "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10",
  C: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10",
  "C-": "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-500/10",
  "D+": "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-500/10",
  D: "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-500/10",
  F: "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10",
};

function getGradeClass(grade: string) {
  return GRADE_COLORS[grade] ?? "text-gray-600 bg-gray-50";
}

function SkeletonCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="h-4 w-4 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent>
        <div className="h-8 w-16 animate-pulse rounded bg-muted mb-1" />
        <div className="h-3 w-28 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}

export function StudentDashboard() {
  const { data: student, isLoading } = useQuery({
    queryKey: ["student", "me"],
    queryFn: async () => {
      const response = await api.get("/api/students/me");
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <div className="h-9 w-80 animate-pulse rounded bg-muted" />
          <div className="h-5 w-56 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <div className="h-5 w-36 animate-pulse rounded bg-muted" />
            </CardHeader>
            <CardContent>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 mb-4">
                  <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <div className="h-5 w-28 animate-pulse rounded bg-muted" />
            </CardHeader>
            <CardContent>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                  </div>
                  <div className="h-6 w-10 animate-pulse rounded bg-muted" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const enrolledCount = student?.enrollments?.filter(
    (e: any) => e.status === "ENROLLED"
  ).length || 0;

  const recentGrades = student?.grades?.slice(0, 5) || [];
  const currentYear = new Date().getFullYear();
  const fallSemester = `Fall ${currentYear}`;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {student?.firstName}!
          </h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {fallSemester} &middot; Student since {student?.enrollmentYear}
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 rounded-lg border bg-card px-4 py-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Department</p>
            <p className="text-sm font-medium">{student?.department?.name ?? "N/A"}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrolledCount}</div>
            <p className="text-xs text-muted-foreground">Current semester enrollment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current GPA</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-500/10">
              <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              student?.gpa ? (student.gpa >= 3.5 ? "text-emerald-600 dark:text-emerald-400" : student.gpa >= 2.5 ? "text-blue-600 dark:text-blue-400" : student.gpa >= 2 ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400") : ""
            }`}>
              {student?.gpa?.toFixed(2) ?? "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">{student?.creditsEarned || 0} credits earned</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits Earned</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
              <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{student?.creditsEarned || 0}</div>
            <p className="text-xs text-muted-foreground">Enrolled {student?.enrollmentYear}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-500/10">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enrolledCount}</div>
            <p className="text-xs text-muted-foreground">Sections this semester</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Classes</CardTitle>
              <CardDescription>Your current enrollment</CardDescription>
            </div>
            <Link
              to="/enrollments"
              className="text-sm text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1"
            >
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </CardHeader>
          <CardContent>
            {student?.enrollments?.filter((e: any) => e.status === "ENROLLED").length > 0 ? (
              <div className="divide-y">
                {student.enrollments
                  .filter((e: any) => e.status === "ENROLLED")
                  .slice(0, 5)
                  .map((enrollment: any, idx: number) => (
                    <div key={enrollment.id} className={`flex items-center gap-4 py-3 ${idx === 0 ? "pt-0" : ""}`}>
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border bg-muted/30">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {enrollment.section?.course?.code} — {enrollment.section?.course?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {enrollment.section?.schedule || "Schedule TBD"}
                          {enrollment.section?.room ? ` · ${enrollment.section.room}` : ""}
                          {enrollment.section?.faculty ? ` · ${enrollment.section.faculty.firstName} ${enrollment.section.faculty.lastName}` : ""}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        Sec {enrollment.section?.sectionNumber}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <BookOpen className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="font-medium text-muted-foreground">No enrolled courses</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Enroll in a section from the Enrollments page
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Grades</CardTitle>
              <CardDescription>Latest academic results</CardDescription>
            </div>
            {recentGrades.length > 0 && (
              <span className="text-xs text-muted-foreground">
                Last {recentGrades.length}
              </span>
            )}
          </CardHeader>
          <CardContent>
            {recentGrades.length > 0 ? (
              <div className="divide-y">
                {recentGrades.map((grade: any, idx: number) => (
                  <div key={grade.id} className={`flex items-center justify-between py-3 ${idx === 0 ? "pt-0" : ""}`}>
                    <div className="min-w-0 flex-1 pr-3">
                      <p className="text-sm font-medium truncate">
                        {grade.section?.course?.code || "N/A"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {grade.section?.course?.name}
                        {grade.section?.course?.credits ? ` · ${grade.section.course.credits} cr` : ""}
                      </p>
                    </div>
                    <span className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-sm font-bold ${getGradeClass(grade.grade)}`}>
                      {grade.grade}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Award className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="font-medium text-muted-foreground">No grades yet</p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  Grades will appear once assessments are completed
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
