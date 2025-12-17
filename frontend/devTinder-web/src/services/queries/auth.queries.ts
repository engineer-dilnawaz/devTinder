import { useMutation } from "@tanstack/react-query";

import { login } from "../api";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: login,
    onSuccess(data) {
      localStorage.setItem("token", data.data?.authToken);
    },
  });
};
