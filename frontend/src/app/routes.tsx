import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Activities } from "./components/Activities";
import { ActivityDetails } from "./components/ActivityDetails";
import { Students } from "./components/Students";
import { StudentDetails } from "./components/StudentDetails";
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "activities", Component: Activities },
      { path: "activities/:id", Component: ActivityDetails },
      { path: "students", Component: Students },
      { path: "students/:id", Component: StudentDetails },
      { path: "*", Component: NotFound },
    ],
  },
]);
