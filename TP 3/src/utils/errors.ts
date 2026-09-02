import { AuthError } from '@supabase/supabase-js'

export interface ParsedAuthError {
  code: string
  message: string
  isRateLimit: boolean
  isEmailNotConfirmed: boolean
}

/**
 * Traduce códigos de error técnicos de Supabase Auth a mensajes comprensibles en español.
 */
export function translateAuthError(error: AuthError | Error | null): ParsedAuthError {
  if (!error) {
    return {
      code: 'UNKNOWN',
      message: 'Ocurrió un error inesperado. Intente nuevamente.',
      isRateLimit: false,
      isEmailNotConfirmed: false,
    }
  }

  const rawMessage = error.message?.toLowerCase() || ''
  const status = (error as any).status || 0
  const errorCode = (error as AuthError).code?.toLowerCase() || ''

  // 1. Rate Limiting (Error 429 u over_request_rate_limit)
  if (status === 429 || errorCode.includes('rate_limit') || rawMessage.includes('rate limit')) {
    return {
      code: 'OVER_RATE_LIMIT',
      message: 'Demasiados intentos. Por favor espera 60 segundos antes de intentar nuevamente.',
      isRateLimit: true,
      isEmailNotConfirmed: false,
    }
  }

  // 2. Email no confirmado
  if (errorCode.includes('email_not_confirmed') || rawMessage.includes('email not confirmed')) {
    return {
      code: 'EMAIL_NOT_CONFIRMED',
      message: 'Tu correo electrónico aún no ha sido confirmado.',
      isRateLimit: false,
      isEmailNotConfirmed: true,
    }
  }

  // 3. Usuario / Email no registrado o no encontrado
  if (
    errorCode.includes('user_not_found') ||
    errorCode.includes('email_not_found') ||
    rawMessage.includes('user not found') ||
    rawMessage.includes('email not found') ||
    rawMessage.includes('no user') ||
    rawMessage.includes('usuario no encontrado')
  ) {
    return {
      code: 'USER_NOT_FOUND',
      message: 'No existe una cuenta registrada con este correo electrónico.',
      isRateLimit: false,
      isEmailNotConfirmed: false,
    }
  }

  // 4. Contraseña incorrecta
  if (
    errorCode.includes('invalid_password') ||
    rawMessage.includes('invalid password') ||
    rawMessage.includes('wrong password') ||
    rawMessage.includes('contraseña incorrecta')
  ) {
    return {
      code: 'INVALID_PASSWORD',
      message: 'La contraseña ingresada es incorrecta.',
      isRateLimit: false,
      isEmailNotConfirmed: false,
    }
  }

  // 5. Credenciales inválidas genéricas
  if (
    errorCode.includes('invalid_credentials') ||
    rawMessage.includes('invalid login credentials') ||
    rawMessage.includes('invalid credentials')
  ) {
    return {
      code: 'INVALID_CREDENTIALS',
      message: 'Email o contraseña incorrectos.',
      isRateLimit: false,
      isEmailNotConfirmed: false,
    }
  }

  // 6. Usuario ya existente en registro
  if (errorCode.includes('user_already_exists') || rawMessage.includes('already registered')) {
    return {
      code: 'USER_ALREADY_EXISTS',
      message: 'Si el correo electrónico ingresado es válido, se enviarán las instrucciones.',
      isRateLimit: false,
      isEmailNotConfirmed: false,
    }
  }

  // 7. Contraseña débil
  if (errorCode.includes('weak_password') || rawMessage.includes('password')) {
    return {
      code: 'WEAK_PASSWORD',
      message: 'La contraseña no cumple con los criterios de seguridad mínimos.',
      isRateLimit: false,
      isEmailNotConfirmed: false,
    }
  }

  // 8. Errores de red explícitos
  if (rawMessage.includes('failed to fetch') || rawMessage.includes('network request failed')) {
    return {
      code: 'NETWORK_ERROR',
      message: 'Error de conexión con Supabase. Verifica tu acceso a internet.',
      isRateLimit: false,
      isEmailNotConfirmed: false,
    }
  }

  // Fallback mostrando el mensaje descriptivo si existe
  return {
    code: errorCode || 'GENERIC_ERROR',
    message: error.message || 'No se pudo completar la solicitud. Verifique los datos e intente nuevamente.',
    isRateLimit: false,
    isEmailNotConfirmed: false,
  }
}
