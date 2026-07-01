import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, BookOpen } from "lucide-react";

interface EnrollmentTableProps {
  enrollments: Array<{
    id: string;
    status: string;
    enrolledAt: string;
    section?: {
      sectionNumber: string;
      semester: string;
      year: number;
      room?: string;
      schedule?: string;
      course?: { name: string; code: string; credits: number };
      faculty?: { firstName: string; lastName: string };
    };
  }>;
  isLoading: boolean;
  onDrop: (enrollmentId: string) => void;
  isDropping: boolean;
}

const STATUS_BADGE: Record<string, { class: string; label: string }> = {
  ENROLLED: { class: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-400/20", label: "Enrolled" },
  DROPPED: { class: "bg-red-50 text-red-700 ring-1 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-400/20", label: "Dropped" },
  COMPLETED: { class: "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 dark:bg-blue-500/10 dark:text-blue-400 dark:ring-blue-400/20", label: "Completed" },
};

export function EnrollmentTable({ enrollments, isLoading, onDrop, isDropping }: EnrollmentTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="h-4 w-32 rounded bg-muted" />
                <div className="h-4 w-20 rounded bg-muted" />
                <div className="h-4 w-24 rounded bg-muted" />
                <div className="h-4 w-16 rounded bg-muted" />
                <div className="h-6 w-16 rounded-full bg-muted" />
                <div className="h-8 w-16 rounded bg-muted" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (enrollments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Enrollments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground/40 mb-4" />
            <p className="font-medium text-muted-foreground">No enrollments yet</p>
            <p className="text-sm text-muted-foreground/60 mt-1">
              Enroll in a course section to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enrollments</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enrollments.map((enrollment) => {
              const course = enrollment.section?.course;
              const badge = STATUS_BADGE[enrollment.status] ?? { class: "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20", label: enrollment.status };
              return (
                <TableRow key={enrollment.id} className="group">
                  <TableCell>
                    <div className="font-medium">{course?.name ?? "-"}</div>
                    <div className="text-xs text-muted-foreground">{course?.code}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">Sec {enrollment.section?.sectionNumber}</div>
                    <div className="text-xs text-muted-foreground">{enrollment.section?.semester} {enrollment.section?.year}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{enrollment.section?.schedule ?? "-"}</div>
                    <div className="text-xs text-muted-foreground">{enrollment.section?.room ?? ""}</div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {enrollment.section?.faculty
                      ? `${enrollment.section.faculty.firstName} ${enrollment.section.faculty.lastName}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.class}`}>
                      {badge.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {enrollment.status === "ENROLLED" && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 hover:border-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={isDropping}
                        onClick={() => onDrop(enrollment.id)}
                      >
                        {isDropping && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
                        Drop
                      </Button>
                    )}
                    {enrollment.status !== "ENROLLED" && (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
