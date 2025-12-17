import { useAuthStore } from "../../stores/auth.store";
import type { LoginResponse } from "./auth.types";

export const handleLoginSucess = (data: LoginResponse) => {
  const setAuth = useAuthStore.getState().setAuth;

  setAuth(data.authToken, data.user);
};
