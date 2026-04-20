import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Activities } from "./components/Activities";
import { ActivityDetails } from "./components/ActivityDetails";
import { Students } from "./components/Students";
import { StudentDetails } from "./components/StudentDetails";
import { Teachers } from "./components/Teachers";
import { NotFound } from "./components/NotFound";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/auth",
    children: [
      { path: "signin", Component: SignIn },
      { path: "signup", Component: SignUp },
    ],
  },
  {
    path: "/",
    Component: Layout,
    children: [
      {
        index: true,
        Component: () => (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "activities",
        Component: () => (
          <ProtectedRoute>
            <Activities />
          </ProtectedRoute>
        ),
      },
      {
        path: "activities/:id",
        Component: () => (
          <ProtectedRoute>
            <ActivityDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "students",
        Component: () => (
          <ProtectedRoute>
            <Students />
          </ProtectedRoute>
        ),
      },
      {
        path: "students/:id",
        Component: () => (
          <ProtectedRoute>
            <StudentDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "teachers",
        Component: () => (
          <ProtectedRoute>
            <Teachers />
          </ProtectedRoute>
        ),
      },
      { path: "*", Component: NotFound },
    ],
  },
]);

