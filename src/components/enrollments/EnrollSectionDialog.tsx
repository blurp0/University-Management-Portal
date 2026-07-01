import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Users, BookOpen, GraduationCap } from "lucide-react";

interface AvailableSection {
  id: string;
  sectionNumber: string;
  semester: string;
  year: number;
  capacity: number;
  enrolled: number;
  room?: string;
  schedule?: string;
  course?: { id: string; name: string; code: string; credits: number };
  faculty?: { id: string; firstName: string; lastName: string };
}

interface EnrollSectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEnroll: (sectionId: string) => void;
  isEnrolling: boolean;
}

export function EnrollSectionDialog({ open, onOpenChange, onEnroll, isEnrolling }: EnrollSectionDialogProps) {
  const [sectionId, setSectionId] = useState("");
  const [sections, setSections] = useState<AvailableSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setLoading(true);
      setSectionId("");
      setError("");
      fetch("/api/sections/available")
        .then(async (res) => {
          const body = await res.json();
          if (body.success) setSections(body.data || []);
          else setError("Failed to load sections");
        })
        .catch(() => setError("Failed to load sections"))
        .finally(() => setLoading(false));
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionId) return;
    onEnroll(sectionId);
    setSectionId("");
  };

  const selectedSection = sections.find((s) => s.id === sectionId);
  const filled = selectedSection ? Math.round((selectedSection.enrolled / selectedSection.capacity) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Enroll in Section</DialogTitle>
          <DialogDescription>
            Select a course section with available seats to enroll.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <Label className="text-base font-medium">Available Sections</Label>
            <p className="text-xs text-muted-foreground mt-0.5 mb-3">
              Showing {sections.length} section{sections.length !== 1 ? "s" : ""} with open seats
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            ) : sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-10 w-10 text-muted-foreground/40 mb-3" />
                <p className="font-medium text-muted-foreground">No sections available</p>
                <p className="text-xs text-muted-foreground/60 mt-1">All sections are currently full.</p>
              </div>
            ) : (
              <ScrollArea className="max-h-[300px] pr-4">
                <RadioGroup value={sectionId} onValueChange={setSectionId} className="space-y-2">
                  {sections.map((s) => {
                    const fillPct = Math.round((s.enrolled / s.capacity) * 100);
                    const isAlmostFull = fillPct >= 80;
                    return (
                      <label
                        key={s.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent has-[:checked]:border-primary has-[:checked]:bg-primary/5 ${
                          sectionId === s.id ? "border-primary bg-primary/5" : ""
                        }`}
                      >
                        <RadioGroupItem value={s.id} id={s.id} className="mt-1" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="font-medium truncate">
                              {s.course?.code} — {s.course?.name}
                            </div>
                            <span className="shrink-0 text-xs text-muted-foreground">{s.course?.credits} cr</span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-xs text-muted-foreground">
                            <span>Sec {s.sectionNumber}</span>
                            <span>{s.semester} {s.year}</span>
                            {s.schedule && <span>{s.schedule}</span>}
                            {s.room && <span>{s.room}</span>}
                            {s.faculty && <span>{s.faculty.firstName} {s.faculty.lastName}</span>}
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isAlmostFull ? "bg-amber-500" : fillPct > 50 ? "bg-primary" : "bg-emerald-500"
                                }`}
                                style={{ width: `${fillPct}%` }}
                              />
                            </div>
                            <span className={`shrink-0 text-xs font-medium ${
                              isAlmostFull ? "text-amber-600" : "text-muted-foreground"
                            }`}>
                              {s.enrolled}/{s.capacity}
                            </span>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </RadioGroup>
              </ScrollArea>
            )}
          </div>

          {selectedSection && (
            <div className="rounded-lg bg-muted/50 p-3 mb-4 flex items-center gap-3 text-sm">
              <GraduationCap className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="font-medium">{selectedSection.course?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedSection.course?.code} · Sec {selectedSection.sectionNumber} · {selectedSection.semester} {selectedSection.year}
                  {selectedSection.schedule && ` · ${selectedSection.schedule}`}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" disabled={isEnrolling} onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!sectionId || isEnrolling || loading}>
              {isEnrolling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Enrollment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
