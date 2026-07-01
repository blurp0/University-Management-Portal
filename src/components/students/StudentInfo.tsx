import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Student } from "@/types/student";

interface StudentInfoProps {
  student: Student;
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value ?? "-"}</p>
    </div>
  );
}

export function StudentInfo({ student }: StudentInfoProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InfoRow
            label="Name"
            value={[student.firstName, student.middleName, student.lastName].filter(Boolean).join(" ")}
          />
          <InfoRow label="Gender" value={student.gender} />
          <InfoRow
            label="Date of Birth"
            value={student.dateOfBirth ? format(new Date(student.dateOfBirth), "MMM d, yyyy") : undefined}
          />
          <InfoRow label="Phone" value={student.phone} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InfoRow label="Address" value={student.address} />
          <InfoRow label="City" value={student.city} />
          <InfoRow label="State" value={student.state} />
          <InfoRow label="Zip Code" value={student.zipCode} />
          <InfoRow label="Country" value={student.country} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Academic</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InfoRow label="Student ID" value={student.studentId} />
          <InfoRow label="Department" value={student.department?.name} />
          <InfoRow label="Enrollment Year" value={student.enrollmentYear} />
          <InfoRow label="Status" value={student.status} />
          <InfoRow label="GPA" value={student.gpa?.toFixed(2)} />
          <InfoRow label="Credits Earned" value={student.creditsEarned} />
        </CardContent>
      </Card>
    </div>
  );
}
