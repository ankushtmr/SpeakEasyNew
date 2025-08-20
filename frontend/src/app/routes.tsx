import { createBrowserRouter } from "react-router-dom";
import Landing from "../pages/Landing";
import Dashboard from "../pages/Dashboard";
import AddEngagement from "../pages/AddEngagement";

export const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/add", element: <AddEngagement /> }
]);
