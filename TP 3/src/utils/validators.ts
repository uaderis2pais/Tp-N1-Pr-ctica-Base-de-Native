import { z } from 'zod'

export interface PasswordRequirementsStatus {
  minLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumber: boolean
  hasSymbol: boolean
  isValidAll: boolean
}

/**
 * Evalúa individualmente cada criterio de seguridad de contraseña para el checklist visual
 */
export function checkPasswordRequirements(password: string = ''): PasswordRequirementsStatus {
  const minLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSymbol = /[^A-Za-z0-9]/.test(password)

  return {
    minLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSymbol,
    isValidAll: minLength && hasUppercase && hasLowercase && hasNumber && hasSymbol,
  }
}

// Esquema de Login
export const loginSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio').email('Formato de email inválido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Esquema de Registro
export const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Ingresa tu nombre completo'),
    email: z.string().min(1, 'El email es obligatorio').email('Formato de email inválido'),
    password: z.string().refine((val) => checkPasswordRequirements(val).isValidAll, {
      message: 'La contraseña debe cumplir con todos los requisitos de seguridad',
    }),
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: 'Debes aceptar los términos y condiciones',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>

// Esquema de Recuperación de Contraseña
export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'El email es obligatorio').email('Formato de email inválido'),
})

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

// Esquema de Restablecer Contraseña
export const resetPasswordSchema = z
  .object({
    password: z.string().refine((val) => checkPasswordRequirements(val).isValidAll, {
      message: 'La contraseña debe cumplir con todos los requisitos de seguridad',
    }),
    confirmPassword: z.string().min(1, 'Confirma tu nueva contraseña'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>
