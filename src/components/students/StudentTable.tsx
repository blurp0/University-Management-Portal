import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Search, Pencil, Trash2, ArrowUpDown, Loader2, Users } from "lucide-react";
import type { Student } from "@/types/student";

interface StudentTableProps {
  students: Student[];
  total: number;
  totalPages: number;
  page: number;
  isLoading: boolean;
  search: string;
  onSearchChange: (value: string) => void;
  onPageChange: (page: number) => void;
  onAdd: () => void;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onView: (student: Student) => void;
}

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-400/20",
  INACTIVE: "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20 dark:bg-gray-500/10 dark:text-gray-400 dark:ring-gray-400/20",
  SUSPENDED: "bg-red-50 text-red-700 ring-1 ring-red-600/20 dark:bg-red-500/10 dark:text-red-400 dark:ring-red-400/20",
};

function getStatusBadge(status?: string) {
  return STATUS_BADGE[status ?? ""] ?? "bg-gray-50 text-gray-700 ring-1 ring-gray-600/20";
}

function getGpaClass(gpa?: number | null) {
  if (gpa == null) return "";
  if (gpa >= 3.5) return "text-emerald-600 font-semibold";
  if (gpa >= 2.5) return "text-blue-600 font-semibold";
  if (gpa >= 2.0) return "text-amber-600 font-semibold";
  return "text-red-600 font-semibold";
}

export function StudentTable({
  students,
  total,
  totalPages,
  page,
  isLoading,
  search,
  onSearchChange,
  onPageChange,
  onAdd,
  onEdit,
  onDelete,
  onView,
}: StudentTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<Student>[] = [
    {
      accessorKey: "studentId",
      header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Student ID <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
    },
    {
      id: "name",
      accessorFn: (row) => `${row.lastName}, ${row.firstName}`,
      header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Name <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: ({ row }) => {
        const s = row.original;
        const initials = [s.firstName?.[0], s.lastName?.[0]].filter(Boolean).join("").toUpperCase();
        return (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">{s.firstName} {s.lastName}</div>
              <div className="text-xs text-muted-foreground truncate">{s.studentId}</div>
            </div>
          </div>
        );
      },
      sortingFn: "text",
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">{row.original.department?.name ?? "-"}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(status)}`}>
            {status ?? "N/A"}
          </span>
        );
      },
    },
    {
      accessorKey: "gpa",
      header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          GPA <ArrowUpDown className="h-3 w-3" />
        </button>
      ),
      cell: ({ row }) => {
        const gpa = row.original.gpa;
        return (
          <span className={getGpaClass(gpa)}>
            {gpa?.toFixed(2) ?? "-"}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const student = row.original;
        return (
          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); onEdit(student); }}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={(e) => { e.stopPropagation(); onDelete(student); }}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: students,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    manualPagination: true,
    pageCount: totalPages,
    rowCount: students.length,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Button onClick={onAdd} size="sm">
          <Plus className="mr-1.5 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="space-y-0">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-6 py-3 animate-pulse border-b last:border-b-0">
                  <div className="h-8 w-8 rounded-full bg-muted shrink-0" />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-4 w-48 rounded bg-muted" />
                    <div className="h-3 w-32 rounded bg-muted" />
                  </div>
                  <div className="h-4 w-24 rounded bg-muted" />
                  <div className="h-6 w-16 rounded-full bg-muted" />
                  <div className="h-4 w-12 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : students.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Users className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <p className="font-medium text-muted-foreground">No students found</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                {search ? "Try a different search term" : "Add your first student to get started"}
              </p>
              {!search && (
                <Button variant="outline" size="sm" className="mt-4" onClick={onAdd}>
                  <Plus className="mr-1.5 h-4 w-4" />
                  Add Student
                </Button>
              )}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="cursor-pointer group"
                      onClick={() => onView(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-3 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {(page - 1) * 10 + 1}–{Math.min(page * 10, total)} of {total}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
