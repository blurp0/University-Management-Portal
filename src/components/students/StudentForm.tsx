import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { studentSchema } from "@/validations/studentSchema";
import type { z } from "zod";
type StudentFormData = z.infer<typeof studentSchema>;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import type { Student } from "@/types/student";

interface StudentFormProps {
  student?: Student;
  onSubmit: (data: StudentFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  departments?: Array<{ id: string; name: string; code: string }>;
}

export function StudentForm({ student, onSubmit, onCancel, isSubmitting, departments }: StudentFormProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema) as any,
    defaultValues: {
      country: "US",
      enrollmentYear: new Date().getFullYear(),
    },
  });

  useEffect(() => {
    if (student) {
      reset({
        firstName: student.firstName,
        lastName: student.lastName,
        middleName: student.middleName ?? "",
        gender: student.gender ?? "MALE",
        dateOfBirth: student.dateOfBirth ? format(new Date(student.dateOfBirth), "yyyy-MM-dd") : "",
        phone: student.phone ?? "",
        address: student.address ?? "",
        city: student.city ?? "",
        state: student.state ?? "",
        zipCode: student.zipCode ?? "",
        country: student.country ?? "US",
        departmentId: student.departmentId,
        enrollmentYear: student.enrollmentYear,
      });
    }
  }, [student, reset]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{student ? "Edit Student" : "Add Student"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input id="middleName" {...register("middleName")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender && <p className="text-sm text-destructive">{errors.gender.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="departmentId">Department</Label>
              {departments ? (
                <Controller
                  name="departmentId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name} ({dept.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <Input id="departmentId" {...register("departmentId")} />
              )}
              {errors.departmentId && <p className="text-sm text-destructive">{errors.departmentId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="enrollmentYear">Enrollment Year</Label>
              <Input
                id="enrollmentYear"
                type="number"
                {...register("enrollmentYear", { valueAsNumber: true })}
              />
              {errors.enrollmentYear && <p className="text-sm text-destructive">{errors.enrollmentYear.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input id="zipCode" {...register("zipCode")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" {...register("country")} />
              {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {student ? "Update" : "Create"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
