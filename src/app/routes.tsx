import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { OAuthCallbackPage } from "@/pages/auth/OAuthCallbackPage";
import { StudentDashboard } from "@/pages/dashboard/StudentDashboard";
import { StudentListPage } from "@/pages/students/StudentListPage";
import { StudentDetailPage } from "@/pages/students/StudentDetailPage";
import { EnrollmentsPage } from "@/pages/students/EnrollmentsPage";
import { Role } from "@/types/user";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/auth/callback",
    element: <OAuthCallbackPage />,
  },
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "dashboard",
        element: <StudentDashboard />,
      },
      {
        path: "students",
        element: <ProtectedRoute allowedRoles={[Role.ADMIN, Role.FACULTY]} />,
        children: [
          {
            path: "",
            element: <StudentListPage />,
          },
          {
            path: ":id",
            element: <StudentDetailPage />,
          },
        ],
      },
      {
        path: "enrollments",
        element: <ProtectedRoute allowedRoles={[Role.STUDENT]} />,
        children: [
          {
            path: "",
            element: <EnrollmentsPage />,
          },
        ],
      },
      {
        path: "faculty",
        element: <ProtectedRoute allowedRoles={[Role.ADMIN]} />,
        children: [
          {
            path: "",
            element: <div>Faculty Page</div>,
          },
        ],
      },
      {
        path: "courses",
        element: <div>Courses Page</div>,
      },
      {
        path: "finance",
        element: <ProtectedRoute allowedRoles={[Role.STUDENT, Role.ADMIN]} />,
        children: [
          {
            path: "",
            element: <div>Finance Page</div>,
          },
        ],
      },
      {
        path: "settings",
        element: <div>Settings Page</div>,
      },
    ],
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]);
