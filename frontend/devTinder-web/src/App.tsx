import { BrowserRouter, Route, Routes } from "react-router";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Singup from "./pages/Singup";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Singup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
