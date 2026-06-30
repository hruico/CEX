import z from "zod";

const signUpSchema = z.object({
  email: z.email(),
  username: z.string(),
  password: z.string().min(8),
});

const signInSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

export default { signInSchema, signUpSchema };
