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
import * as Linking from 'expo-linking'
import { Ionicons } from '@expo/vector-icons'

import { theme } from '../../src/theme/theme'
import { supabase } from '../../src/lib/supabase'
import { useAuth } from '../../src/context/AuthContext'
import { translateAuthError } from '../../src/utils/errors'
import { registerSchema, RegisterFormData } from '../../src/utils/validators'

import { CustomInput } from '../../src/components/ui/CustomInput'
import { CustomButton } from '../../src/components/ui/CustomButton'
import { CustomCheckbox } from '../../src/components/ui/CustomCheckbox'
import { ErrorMessageBanner } from '../../src/components/ui/ErrorMessageBanner'
import { PasswordChecklist } from '../../src/components/PasswordChecklist'
import { HeaderIllustration } from '../../src/components/HeaderIllustration'
import { ScreenHeader } from '../../src/components/ScreenHeader'
import { CaptchaModal } from '../../src/components/CaptchaModal'

export default function RegisterScreen() {
  const router = useRouter()
  const { setPendingEmail } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)

  // CAPTCHA Obligatorio (Puntos Extra)
  const [showCaptcha, setShowCaptcha] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
    },
  })

  const passwordValue = watch('password') || ''
  const isButtonValid = isValid && captchaToken !== null

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

  const onSubmit = async (data: RegisterFormData) => {
    if (!captchaToken || isLoading || cooldown > 0) return
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const emailRedirectTo = Linking.createURL('confirm')

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email.trim(),
        password: data.password,
        options: {
          emailRedirectTo,
          captchaToken,
          data: {
            full_name: data.fullName.trim(),
          },
        },
      })

      if (error) {
        const parsed = translateAuthError(error)

        if (parsed.isRateLimit) {
          setCooldown(60)
        }

        setErrorMessage(parsed.message)
        setCaptchaToken(null)
        return
      }

      // Guardar email y navegar a pantalla de confirmación pendiente
      setPendingEmail(data.email.trim())
      router.push('/(auth)/pending-confirm')
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
      <ScreenHeader title="Crear cuenta" />

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
              <Text style={styles.title}>Bienvenido a nosotros</Text>
              <Text style={styles.subtitle}>Completá tus datos para registrarte</Text>
            </View>

            <HeaderIllustration iconName="person-add-outline" />

            <ErrorMessageBanner message={errorMessage} type="error" />

            <View style={styles.formSection}>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Nombre completo"
                    placeholder="Ej: Juan Pérez"
                    leftIcon="person-outline"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.fullName?.message}
                    disabled={isLoading}
                  />
                )}
              />

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

              {/* Checklist visual de fortaleza de contraseña */}
              <PasswordChecklist password={passwordValue} />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Confirmar contraseña"
                    placeholder="••••••••"
                    isPassword
                    leftIcon="lock-closed-outline"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.confirmPassword?.message}
                    disabled={isLoading}
                  />
                )}
              />

              <Controller
                control={control}
                name="termsAccepted"
                render={({ field: { onChange, value } }) => (
                  <CustomCheckbox
                    checked={value}
                    onToggle={onChange}
                    error={errors.termsAccepted?.message}
                    disabled={isLoading}
                  />
                )}
              />

              {/* Botón Obligatorio de Verificación de CAPTCHA */}
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
                    : 'Completar CAPTCHA (Obligatorio)'}
                </Text>
              </TouchableOpacity>

              <CustomButton
                title={isLoading ? 'Creando cuenta...' : 'Registrarse'}
                loading={isLoading}
                cooldownSeconds={cooldown}
                disabled={!isButtonValid}
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>¿Ya tenés una cuenta? </Text>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/login')}
                disabled={isLoading}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.loginLink}>Iniciar Sesión</Text>
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
  captchaTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
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
  loginLink: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 14,
    color: theme.colors.primary,
  },
})
