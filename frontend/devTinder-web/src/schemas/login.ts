import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().trim().min(1, "Password is required"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
