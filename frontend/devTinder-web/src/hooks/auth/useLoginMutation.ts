import { useMutation } from "@tanstack/react-query";

import { handleLoginSucess, login } from "../../services/auth";

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: login,
    onSuccess({ data }) {
      handleLoginSucess(data);
    },
  });
};
