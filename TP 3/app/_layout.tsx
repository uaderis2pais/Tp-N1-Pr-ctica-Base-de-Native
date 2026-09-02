import React, { useEffect } from 'react'
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { Slot, useRouter, useSegments } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins'

import { AuthProvider, useAuth } from '../src/context/AuthContext'
import { theme } from '../src/theme/theme'
import { BiometricLockOverlay } from '../src/components/BiometricLockOverlay'

function NavigationGuard() {
  const { session, isLoading: isAuthLoading, isPasswordRecovery } = useAuth()
  const segments = useSegments()
  const router = useRouter()

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  })

  const isLoading = isAuthLoading || !fontsLoaded

  useEffect(() => {
    if (isLoading) return

    const inAuthGroup = segments[0] === '(auth)'
    const inAppGroup = segments[0] === '(app)'
    const isResetPasswordScreen = segments.includes('reset-password')

    // 1. Prioridad Absoluta: Si la app fue abierta vía Deep Link para restablecimiento de contraseña
    if (isPasswordRecovery || isResetPasswordScreen) {
      if (!isResetPasswordScreen) {
        router.replace('/(auth)/reset-password')
      }
      return
    }

    // 2. Usuario autenticado intentando entrar a pantallas de Auth -> Redirigir a Home
    if (session && inAuthGroup) {
      router.replace('/(app)/home')
      return
    }

    // 3. Usuario no autenticado intentando entrar a pantallas de App -> Redirigir a Login
    if (!session && inAppGroup) {
      router.replace('/(auth)/login')
      return
    }
  }, [session, isLoading, isPasswordRecovery, segments])

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    )
  }

  return (
    <>
      <Slot />
      {/* Bloqueo por Biometría/PIN al volver del segundo plano estilo MercadoPago */}
      <BiometricLockOverlay />
    </>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" backgroundColor={theme.colors.background} />
      <NavigationGuard />
    </AuthProvider>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
