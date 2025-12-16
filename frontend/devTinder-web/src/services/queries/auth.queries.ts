import { useMutation } from "@tanstack/react-query";

import { login } from "../api";
import type { LoginPayload } from "../types";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => login(data),
    onSuccess(data) {
      localStorage.setItem("token", data.data.authToken);
    },
  });
};
