import z from "zod";

export const PASSWORD_MIN_LENGTH = 8;

export const loginSchema = z.object({
	// trim + lowercase trước khi validate → data sạch khi vào onSubmit
	email: z.email().trim().toLowerCase(),
	password: z.string().min(PASSWORD_MIN_LENGTH, {message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`}),
})

export type LoginFormValues = z.infer<typeof loginSchema>
