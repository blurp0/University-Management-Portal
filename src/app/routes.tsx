import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { OAuthCallbackPage } from "@/pages/auth/OAuthCallbackPage";
import { StudentDashboard } from "@/pages/dashboard/StudentDashboard";
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
            element: <div>Students Page</div>,
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
