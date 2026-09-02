import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Ionicons } from '@expo/vector-icons'
import * as Linking from 'expo-linking'

import { theme } from '../../src/theme/theme'
import { supabase } from '../../src/lib/supabase'
import { useAuth } from '../../src/context/AuthContext'
import { translateAuthError } from '../../src/utils/errors'
import { forgotPasswordSchema, ForgotPasswordFormData } from '../../src/utils/validators'

import { CustomInput } from '../../src/components/ui/CustomInput'
import { CustomButton } from '../../src/components/ui/CustomButton'
import { ErrorMessageBanner } from '../../src/components/ui/ErrorMessageBanner'
import { HeaderIllustration } from '../../src/components/HeaderIllustration'
import { ScreenHeader } from '../../src/components/ScreenHeader'

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const { setIsPasswordRecovery } = useAuth()

  const [step, setStep] = useState<'request' | 'verify_code'>('request')
  const [sentEmail, setSentEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const [neutralMessage, setNeutralMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    getValues,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  })

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

  // Paso 1: Enviar instrucciones y código por email
  const onSubmitEmail = async (data: ForgotPasswordFormData) => {
    if (isLoading || cooldown > 0) return
    setIsLoading(true)
    setErrorMessage(null)
    setNeutralMessage(null)

    try {
      const emailTrimmed = data.email.trim()
      setSentEmail(emailTrimmed)

      const redirectTo = Linking.createURL('reset-password')

      const { error } = await supabase.auth.resetPasswordForEmail(emailTrimmed, {
        redirectTo,
      })

      if (error) {
        const parsed = translateAuthError(error)
        if (parsed.isRateLimit) {
          setCooldown(60)
          setErrorMessage(parsed.message)
          return
        }
      }

      setCooldown(60)
      setStep('verify_code')
      setNeutralMessage(
        'Si el email existe en nuestro sistema, vas a recibir las instrucciones y un código de 6 dígitos.'
      )
    } catch (err: any) {
      const parsed = translateAuthError(err)
      setErrorMessage(parsed.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Paso 2: Verificar el código de 6 dígitos (OTP) directo en la app (Figma Forgot password #3 & #4)
  const handleVerifyCode = async () => {
    if (!otpCode || otpCode.trim().length < 6 || isLoading) return
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: sentEmail || getValues('email').trim(),
        token: otpCode.trim(),
        type: 'recovery',
      })

      if (error) {
        const parsed = translateAuthError(error)
        setErrorMessage('El código ingresado es incorrecto o ha expirado.')
        return
      }

      // Si el código es válido, Supabase inicia la sesión de recuperación
      setIsPasswordRecovery(true)
      router.replace('/(auth)/reset-password')
    } catch (err: any) {
      const parsed = translateAuthError(err)
      setErrorMessage(parsed.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.root}>
      {/* Barra superior Púrpura #281C9D */}
      <ScreenHeader
        title="Recuperar contraseña"
        onBack={() => {
          if (step === 'verify_code') {
            setStep('request')
          } else {
            router.back()
          }
        }}
      />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Contenedor Blanco Curvado */}
          <View style={styles.curvedCard}>
            <View style={styles.headerTitles}>
              <Text style={styles.title}>Recuperar contraseña</Text>
              <Text style={styles.subtitle}>
                {step === 'request'
                  ? 'Ingresá tu correo para restablecer tu clave'
                  : 'Ingresá el código de 6 dígitos o usa el enlace del mail'}
              </Text>
            </View>

            {/* Ilustración de llaves */}
            <HeaderIllustration iconName="key-outline" />

            <ErrorMessageBanner message={errorMessage} type="error" />
            <ErrorMessageBanner message={neutralMessage} type="info" />

            {/* Formulario Paso 1: Solicitar Email */}
            {step === 'request' ? (
              <View style={styles.formSection}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <CustomInput
                      label="Correo electrónico"
                      placeholder="ejemplo@email.com"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      leftIcon="mail-outline"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.email?.message}
                      disabled={isLoading}
                    />
                  )}
                />

                <CustomButton
                  title={isLoading ? 'Enviando...' : 'Enviar Instrucciones'}
                  loading={isLoading}
                  cooldownSeconds={cooldown}
                  disabled={!isValid}
                  onPress={handleSubmit(onSubmitEmail)}
                  style={styles.submitButton}
                />
              </View>
            ) : (
              /* Formulario Paso 2: Ingresar Código OTP (Figma Forgot password #3 & #4) */
              <View style={styles.formSection}>
                <Text style={styles.emailNotificationText}>
                  Enviamos un código de verificación a:{'\n'}
                  <Text style={styles.emailHighlight}>{sentEmail}</Text>
                </Text>

                <CustomInput
                  label="Código de 6 dígitos"
                  placeholder="Ej: 123456"
                  keyboardType="number-pad"
                  maxLength={6}
                  leftIcon="shield-checkmark-outline"
                  value={otpCode}
                  onChangeText={setOtpCode}
                  disabled={isLoading}
                />

                <CustomButton
                  title={isLoading ? 'Verificando...' : 'Verificar Código'}
                  loading={isLoading}
                  disabled={otpCode.trim().length < 6}
                  onPress={handleVerifyCode}
                  style={styles.submitButton}
                />

                <CustomButton
                  title="Reenviar código"
                  variant="outline"
                  loading={isLoading}
                  cooldownSeconds={cooldown}
                  onPress={handleSubmit(onSubmitEmail)}
                  style={styles.resendCodeButton}
                />
              </View>
            )}

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')} disabled={isLoading}>
                <Text style={styles.loginLink}>Volver al inicio de sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  container: {
    flex: 1,
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
  formSection: {
    marginTop: theme.spacing.sm,
  },
  emailNotificationText: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    lineHeight: 18,
  },
  emailHighlight: {
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primary,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  resendCodeButton: {
    marginTop: theme.spacing.sm,
  },
  footer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  loginLink: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 14,
    color: theme.colors.primary,
  },
})
