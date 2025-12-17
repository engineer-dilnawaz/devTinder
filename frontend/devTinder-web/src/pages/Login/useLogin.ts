import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "../../hooks";
import { loginSchema, type LoginSchema } from "../../schemas";

export const useLogin = () => {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { mutate, isPending, error } = useLoginMutation();

  const handleSubmit = form.handleSubmit((values) => {
    mutate(
      { emailId: values.email, password: values.password },
      {
        onSuccess() {
          form.reset();
        },
      }
    );
  });

  return {
    ...form,
    loading: isPending,
    mutationError: error,
    handleSubmit,
  };
};
