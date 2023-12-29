import z from "zod";

export const CreateUserSchema = z.object({
  name: z.string(),
  username: z.string(),
  password: z.string()
})

export type CreateUser = z.infer<typeof CreateUserSchema>
