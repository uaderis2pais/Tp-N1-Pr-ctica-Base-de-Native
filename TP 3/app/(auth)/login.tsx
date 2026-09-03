import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Ionicons } from '@expo/vector-icons'

import { theme } from '../../src/theme/theme'
import { supabase } from '../../src/lib/supabase'
import { useAuth } from '../../src/context/AuthContext'
import { translateAuthError } from '../../src/utils/errors'
import { loginSchema, LoginFormData } from '../../src/utils/validators'

import { CustomInput } from '../../src/components/ui/CustomInput'
import { CustomButton } from '../../src/components/ui/CustomButton'
import { ErrorMessageBanner } from '../../src/components/ui/ErrorMessageBanner'
import { HeaderIllustration } from '../../src/components/HeaderIllustration'
import { ScreenHeader } from '../../src/components/ScreenHeader'
import { CaptchaModal } from '../../src/components/CaptchaModal'

export default function LoginScreen() {
  const router = useRouter()
  const { setPendingEmail } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)

  // CAPTCHA Modal (Puntos Extra)
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const emailValue = watch('email')
  const passwordValue = watch('password')

  const isButtonFormValid = isValid && emailValue?.length > 0 && passwordValue?.length > 0

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [cooldown])

  const onSubmit = async (data: LoginFormData) => {
    if (isLoading || cooldown > 0) return
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const options = captchaToken ? { captchaToken } : undefined

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email.trim(),
        password: data.password,
        options,
      })

      if (error) {
        console.warn('Error en signInWithPassword:', error)
        const parsed = translateAuthError(error)

        if (parsed.isEmailNotConfirmed) {
          setPendingEmail(data.email.trim())
          router.push('/(auth)/pending-confirm')
          return
        }

        if (parsed.isRateLimit) {
          setCooldown(60)
        }

        setErrorMessage(parsed.message)
        setCaptchaToken(null)
        return
      }
    } catch (err: any) {
      const parsed = translateAuthError(err)
      setErrorMessage(parsed.message)
      setCaptchaToken(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.root}>
      {/* Barra superior Púrpura #281C9D */}
      <ScreenHeader title="Iniciar sesión" showBack={false} />

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
              <Text style={styles.title}>Bienvenido de nuevo</Text>
              <Text style={styles.subtitle}>Hola, ingresá para continuar</Text>
            </View>

            <HeaderIllustration iconName="lock-closed" />

            <ErrorMessageBanner message={errorMessage} type="error" />

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

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Contraseña"
                    placeholder="••••••••"
                    isPassword
                    leftIcon="lock-closed-outline"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                    disabled={isLoading}
                  />
                )}
              />

              <TouchableOpacity
                style={styles.forgotPasswordLink}
                onPress={() => router.push('/(auth)/forgot-password')}
                disabled={isLoading}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

              {/* Botón de Verificación de CAPTCHA (Opcional) */}
              <TouchableOpacity
                style={[
                  styles.captchaTrigger,
                  captchaToken ? styles.captchaVerified : styles.captchaPending,
                ]}
                onPress={() => setShowCaptcha(true)}
              >
                <Ionicons
                  name={captchaToken ? 'checkmark-circle' : 'shield-checkmark-outline'}
                  size={20}
                  color={captchaToken ? theme.colors.success : theme.colors.primary}
                />
                <Text
                  style={[
                    styles.captchaTriggerText,
                    captchaToken && { color: theme.colors.success },
                  ]}
                >
                  {captchaToken
                    ? '✓ CAPTCHA Verificado'
                    : 'Completar CAPTCHA (Opcional)'}
                </Text>
              </TouchableOpacity>

              <CustomButton
                title={isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                loading={isLoading}
                cooldownSeconds={cooldown}
                disabled={!isButtonFormValid}
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>¿No tenés una cuenta? </Text>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/register')}
                disabled={isLoading}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.registerLink}>Registrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de CAPTCHA hCaptcha / Turnstile (Puntos Extra) */}
      <CaptchaModal
        visible={showCaptcha}
        onClose={() => setShowCaptcha(false)}
        onTokenReceived={(token) => setCaptchaToken(token)}
      />
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
  },
  formSection: {
    marginTop: theme.spacing.sm,
  },
  forgotPasswordLink: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.md,
    marginTop: -theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
  },
  forgotPasswordText: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  captchaTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
  },
  captchaPending: {
    backgroundColor: theme.colors.primaryLight,
    borderColor: theme.colors.primary + '30',
  },
  captchaVerified: {
    backgroundColor: '#E8F8F5',
    borderColor: theme.colors.success + '40',
  },
  captchaTriggerText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 13,
    color: theme.colors.primary,
    marginLeft: theme.spacing.xs,
  },
  submitButton: {
    marginTop: theme.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.xs,
  },
  footerText: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  registerLink: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 14,
    color: theme.colors.primary,
  },
})
