import { z } from 'zod'

const emailSchema = z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')

const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(72, 'Password must be at most 72 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')

const confirmPasswordRefine = (data: { password: string; confirmPassword: string }) =>
    data.password === data.confirmPassword

export const loginSchema = z.object({
    email: emailSchema,
    password: z.string().min(1, 'Password is required'),
})

export const signupSchema = z
    .object({
        email: emailSchema,
        password: passwordSchema,
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine(confirmPasswordRefine, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

export const forgotPasswordSchema = z.object({
    email: emailSchema,
})

export const resetPasswordSchema = z
    .object({
        password: passwordSchema,
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine(confirmPasswordRefine, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
