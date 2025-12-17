import { Navigate, Outlet } from "react-router";

import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useAuthStore } from "../stores/auth.store";

export const ProtectedRoutes = () => {
  const authToken = useAuthStore((state) => state.token);

  if (!authToken) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};
