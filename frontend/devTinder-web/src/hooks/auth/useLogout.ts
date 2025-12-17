import { useMutation } from "@tanstack/react-query";
import { logout } from "../../services/auth";
import { useAuthStore } from "../../stores/auth.store";

export const useLogout = () => {
  return useMutation({
    mutationFn: logout,
    onSuccess() {
      useAuthStore.getState().logout();
    },
  });
};
