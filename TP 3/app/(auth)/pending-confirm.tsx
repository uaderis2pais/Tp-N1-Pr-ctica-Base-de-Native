import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { theme } from '../../src/theme/theme'
import { supabase } from '../../src/lib/supabase'
import { useAuth } from '../../src/context/AuthContext'
import { translateAuthError } from '../../src/utils/errors'

import { CustomInput } from '../../src/components/ui/CustomInput'
import { CustomButton } from '../../src/components/ui/CustomButton'
import { ErrorMessageBanner } from '../../src/components/ui/ErrorMessageBanner'
import { HeaderIllustration } from '../../src/components/HeaderIllustration'
import { ScreenHeader } from '../../src/components/ScreenHeader'

export default function PendingConfirmScreen() {
  const router = useRouter()
  const { pendingEmail } = useAuth()

  const [otpCode, setOtpCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isSuccessMessage, setIsSuccessMessage] = useState(false)

  // Temporizador de 60 segundos
  useEffect(() => {
    if (cooldown <= 0) return

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldown > 0])

  // Reenviar email de confirmación
  const handleResendEmail = async () => {
    if (!pendingEmail || isLoading || cooldown > 0) return

    setIsLoading(true)
    setStatusMessage(null)
    setIsSuccessMessage(false)

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: pendingEmail,
      })

      if (error) {
        console.warn('Error en resend signup:', error)
        const parsed = translateAuthError(error)
        if (parsed.isRateLimit) {
          setCooldown(60)
        }
        setStatusMessage(parsed.message)
        setIsSuccessMessage(false)
      } else {
        setCooldown(60)
        setStatusMessage('Se ha enviado un nuevo enlace y código de confirmación a tu correo.')
        setIsSuccessMessage(true)
      }
    } catch (err: any) {
      const parsed = translateAuthError(err)
      setStatusMessage(parsed.message)
      setIsSuccessMessage(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Verificar el código de confirmación de registro (de 6 a 8 dígitos)
  const handleVerifyCode = async () => {
    if (!pendingEmail || !otpCode || otpCode.trim().length < 6 || isLoading) return
    setIsLoading(true)
    setStatusMessage(null)

    try {
      // 1. Intentar con type: 'signup'
      let { data, error } = await supabase.auth.verifyOtp({
        email: pendingEmail,
        token: otpCode.trim(),
        type: 'signup',
      })

      // 2. Fallback a type: 'email' por compatibilidad de tipos de Supabase
      if (error) {
        console.warn('Error en verifyOtp signup, intentando tipo email:', error)
        const retry = await supabase.auth.verifyOtp({
          email: pendingEmail,
          token: otpCode.trim(),
          type: 'email',
        })
        error = retry.error
      }

      if (error) {
        console.warn('Error en verifyOtp final:', error)
        const parsed = translateAuthError(error)
        setStatusMessage('El código de confirmación es incorrecto o ha expirado.')
        setIsSuccessMessage(false)
        return
      }

      // Si la verificación es exitosa, AuthContext actualizará el estado y redirigirá automáticamente a Home
    } catch (err: any) {
      const parsed = translateAuthError(err)
      setStatusMessage(parsed.message)
      setIsSuccessMessage(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.root}>
      {/* Barra superior Púrpura #281C9D */}
      <ScreenHeader
        title="Confirmar correo"
        onBack={() => router.replace('/(auth)/login')}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Contenedor Blanco Curvado */}
        <View style={styles.curvedCard}>
          <View style={styles.headerTitles}>
            <Text style={styles.title}>Confirmá tu correo</Text>
            <Text style={styles.subtitle}>Enviamos un enlace y código a tu casilla</Text>
          </View>

          <HeaderIllustration iconName="mail-unread-outline" />

          <ErrorMessageBanner
            message={statusMessage}
            type={isSuccessMessage ? 'success' : 'error'}
          />

          <View style={styles.infoSection}>
            <Text style={styles.description}>
              Enviamos un código y enlace de verificación a:
            </Text>

            <View style={styles.emailBadge}>
              <Ionicons name="mail-outline" size={18} color={theme.colors.primary} />
              <Text style={styles.emailText}>
                {pendingEmail || 'tu-correo@ejemplo.com'}
              </Text>
            </View>

            {/* Campo para ingresar el código (acepta de 6 a 8 dígitos) */}
            <CustomInput
              label="Código de verificación"
              placeholder="Ej: 12345678"
              keyboardType="number-pad"
              maxLength={8}
              leftIcon="shield-checkmark-outline"
              value={otpCode}
              onChangeText={setOtpCode}
              disabled={isLoading}
            />

            <CustomButton
              title={isLoading ? 'Verificando...' : 'Verificar e Ingresar'}
              loading={isLoading}
              disabled={otpCode.trim().length < 6}
              onPress={handleVerifyCode}
              variant="primary"
              style={styles.verifyButton}
            />

            <CustomButton
              title={isLoading ? 'Enviando...' : 'Reenviar email'}
              loading={isLoading}
              cooldownSeconds={cooldown}
              onPress={handleResendEmail}
              variant="outline"
              style={styles.resendButton}
            />
          </View>

          <TouchableOpacity
            style={styles.backToLogin}
            onPress={() => router.replace('/(auth)/login')}
            disabled={isLoading}
          >
            <Text style={styles.backToLoginText}>Volver a Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: theme.colors.primary,
  },
  curvedCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    minHeight: '100%',
    alignItems: 'center',
  },
  headerTitles: {
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 24,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  infoSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  description: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  emailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primaryLight,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  emailText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 14,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  verifyButton: {
    width: '100%',
    marginBottom: theme.spacing.sm,
  },
  resendButton: {
    width: '100%',
  },
  backToLogin: {
    marginTop: theme.spacing.xl,
  },
  backToLoginText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 14,
    color: theme.colors.primary,
  },
})
