import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../stores/auth.store";

export const ProtectedRoutes = () => {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
};
