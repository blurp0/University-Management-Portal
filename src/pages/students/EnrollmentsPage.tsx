import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useEnrollments } from "@/hooks/useEnrollments";
import { EnrollmentTable } from "@/components/enrollments/EnrollmentTable";
import { EnrollSectionDialog } from "@/components/enrollments/EnrollSectionDialog";
import { Plus } from "lucide-react";

export function EnrollmentsPage() {
  const [page] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);

  const {
    enrollments,
    isLoading,
    enroll,
    drop,
    isEnrolling,
    isDropping,
  } = useEnrollments(page, 10, "");

  const handleEnroll = (sectionId: string) => {
    enroll(sectionId);
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Enrollments</h1>
          <p className="text-muted-foreground">
            View and manage your course enrollments
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Enroll in Section
        </Button>
      </div>

      <EnrollmentTable
        enrollments={enrollments}
        isLoading={isLoading}
        onDrop={drop}
        isDropping={isDropping}
      />

      <EnrollSectionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onEnroll={handleEnroll}
        isEnrolling={isEnrolling}
      />
    </div>
  );
}
