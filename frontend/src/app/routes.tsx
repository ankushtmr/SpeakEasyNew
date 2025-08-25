import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import Dashboard from "../pages/Dashboard";
import AddEngagement from "../pages/AddEngagement";
import RequireAuth from "../components/RequireAuth";

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/dashboard", element: <RequireAuth><Dashboard /></RequireAuth> },
  { path: "/add", element: <RequireAuth><AddEngagement /></RequireAuth> }
]);
