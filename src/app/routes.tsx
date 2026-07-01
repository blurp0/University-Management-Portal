import { createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LoginPage } from "@/pages/auth/LoginPage";
import { RegisterPage } from "@/pages/auth/RegisterPage";
import { StudentDashboard } from "@/pages/dashboard/StudentDashboard";

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
    path: "/",
    element: <DashboardLayout />,
    children: [
      {
        path: "dashboard",
        element: <StudentDashboard />,
      },
      {
        path: "students",
        element: <div>Students Page</div>,
      },
      {
        path: "faculty",
        element: <div>Faculty Page</div>,
      },
      {
        path: "courses",
        element: <div>Courses Page</div>,
      },
      {
        path: "finance",
        element: <div>Finance Page</div>,
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
