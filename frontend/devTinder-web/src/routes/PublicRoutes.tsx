import { Navigate, Outlet } from "react-router";

import { useAuthStore } from "../stores/auth.store";

export const PublicRoutes = () => {
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to="/feed" replace />;
  return <Outlet />;
};
