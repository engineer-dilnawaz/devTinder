import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

import { AppLayout } from "./layout/AppLayout";
import { ErrorPage } from "./pages/ErrorPage";
import Feed from "./pages/Feed";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Singup from "./pages/Singup";
import { ProtectedRoutes } from "./routes/ProtectedRoutes";
import { PublicRoutes } from "./routes/PublicRoutes";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <ErrorPage />, // ⬅️ ERRORS FALLBACK HERE
      children: [
        {
          element: <PublicRoutes />,
          children: [
            { path: "login", element: <Login /> },
            { path: "signup", element: <Singup /> },
            { path: "forgot-password", element: <ForgotPassword /> },
          ],
        },
        {
          element: <ProtectedRoutes />,
          children: [
            { path: "feed", element: <Feed /> },
            { path: "profile", element: <Profile /> },
            { path: "settings", element: <Settings /> },
          ],
        },
        { index: true, element: <Navigate to="/feed" replace /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
