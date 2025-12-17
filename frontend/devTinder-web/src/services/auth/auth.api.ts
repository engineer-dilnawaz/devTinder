import api from "../../api/axios";
import type { LoginPayload, LoginResponse } from "./auth.types";
import type { ApiResponse } from "../../api/api.types";

export const login = (
  data: LoginPayload
): Promise<ApiResponse<LoginResponse>> => {
  return api.post("/login", data);
};

export const register = (data: LoginPayload) => {
  return api.post("/register", data);
};
