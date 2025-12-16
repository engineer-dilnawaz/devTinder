import api from "./axios";
import type { LoginPayload, LoginResponse, ApiResponse } from "../types";

export const login = (
  data: LoginPayload
): Promise<ApiResponse<LoginResponse>> => {
  return api.post("/auth/login", data);
};

export const register = (data: LoginPayload) => {
  return api.post("/auth/register", data);
};
