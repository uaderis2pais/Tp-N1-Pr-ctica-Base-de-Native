import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { theme } from '../../src/theme/theme'
import { supabase } from '../../src/lib/supabase'
import { useAuth } from '../../src/context/AuthContext'
import { translateAuthError } from '../../src/utils/errors'
import { resetPasswordSchema, ResetPasswordFormData } from '../../src/utils/validators'

import { CustomInput } from '../../src/components/ui/CustomInput'
import { CustomButton } from '../../src/components/ui/CustomButton'
import { ErrorMessageBanner } from '../../src/components/ui/ErrorMessageBanner'
import { PasswordChecklist } from '../../src/components/PasswordChecklist'
import { HeaderIllustration } from '../../src/components/HeaderIllustration'
import { ScreenHeader } from '../../src/components/ScreenHeader'

export default function ResetPasswordScreen() {
  const router = useRouter()
  const { session, isPasswordRecovery, signOut } = useAuth()

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLinkInvalid, setIsLinkInvalid] = useState(false)

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  })

  const passwordValue = watch('password') || ''

  useEffect(() => {
    if (!session && !isPasswordRecovery) {
      setIsLinkInvalid(true)
    } else {
      setIsLinkInvalid(false)
    }
  }, [session, isPasswordRecovery])

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (isLoading) return
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      })

      if (error) {
        const parsed = translateAuthError(error)
        setErrorMessage(parsed.message)
        return
      }

      await signOut()
      router.replace('/(auth)/login')
    } catch (err: any) {
      const parsed = translateAuthError(err)
      setErrorMessage(parsed.message)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLinkInvalid) {
    return (
      <View style={styles.root}>
        <ScreenHeader title="Cambiar contraseña" showBack={false} />
        <View style={styles.invalidCurvedCard}>
          <HeaderIllustration iconName="warning-outline" />

          <Text style={styles.invalidTitle}>Enlace Inválido o Expirado</Text>

          <Text style={styles.invalidDescription}>
            El enlace de recuperación que abriste ya no es válido o ha expirado. Por razones de seguridad, debes solicitar un nuevo enlace.
          </Text>

          <CustomButton
            title="Solicitar nuevo enlace"
            onPress={() => router.replace('/(auth)/forgot-password')}
            style={styles.invalidButton}
          />
        </View>
      </View>
    )
  }

  return (
    <View style={styles.root}>
      {/* Barra superior Púrpura #281C9D (< Cambiar contraseña) */}
      <ScreenHeader title="Cambiar contraseña" />

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
              <Text style={styles.title}>Cambiar contraseña</Text>
              <Text style={styles.subtitle}>Ingresá y confirma tu nueva clave de acceso</Text>
            </View>

            {/* Ilustración de escudo */}
            <HeaderIllustration iconName="shield-checkmark-outline" />

            <ErrorMessageBanner message={errorMessage} type="error" />

            {/* Formulario */}
            <View style={styles.formSection}>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Nueva contraseña"
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

              <PasswordChecklist password={passwordValue} />

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <CustomInput
                    label="Confirmar nueva contraseña"
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

              <CustomButton
                title={isLoading ? 'Guardando...' : 'Cambiar contraseña'}
                loading={isLoading}
                disabled={!isValid}
                onPress={handleSubmit(onSubmit)}
                style={styles.submitButton}
              />
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
  },
  formSection: {
    marginTop: theme.spacing.sm,
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
  invalidCurvedCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    alignItems: 'center',
  },
  invalidTitle: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 22,
    color: theme.colors.primary,
    textAlign: 'center',
    marginVertical: theme.spacing.sm,
  },
  invalidDescription: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 22,
  },
  invalidButton: {
    width: '100%',
  },
})
