import React, { useEffect, useState } from 'react'
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AppState,
  AppStateStatus,
} from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'
import { Ionicons } from '@expo/vector-icons'
import { theme } from '../theme/theme'
import { useAuth } from '../context/AuthContext'

export const BiometricLockOverlay: React.FC = () => {
  const { session } = useAuth()
  const [isLocked, setIsLocked] = useState(false)
  const [isBiometricSupported, setIsBiometricSupported] = useState(false)

  // 1. Verificar disponibilidad de hardware al inicio
  useEffect(() => {
    checkBiometricHardware()
  }, [])

  const checkBiometricHardware = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      const isEnrolled = await LocalAuthentication.isEnrolledAsync()
      setIsBiometricSupported(hasHardware && isEnrolled)
    } catch {
      setIsBiometricSupported(false)
    }
  }

  // 2. Escuchar cambios de AppState (segundo plano a activo estilo MercadoPago)
  useEffect(() => {
    if (!session || !isBiometricSupported) return

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background') {
        setIsLocked(true)
      } else if (nextAppState === 'active' && isLocked) {
        promptAuthentication()
      }
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange)
    return () => subscription.remove()
  }, [session, isBiometricSupported, isLocked])

  // Desencadenar la verificación biométrica del sistema operativo
  const promptAuthentication = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Desbloquear iBank',
        cancelLabel: 'Cancelar',
        disableDeviceFallback: false,
      })

      if (result.success) {
        setIsLocked(false)
      }
    } catch (e) {
      console.warn('Error en autenticación biométrica de bloqueo:', e)
    }
  }

  if (!session || !isLocked) return null

  return (
    <Modal visible={isLocked} animationType="fade" transparent={false}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={40} color={theme.colors.primary} />
          </View>

          <Text style={styles.title}>iBank Bloqueado</Text>
          <Text style={styles.subtitle}>
            Verificá tu identidad con Biometría o PIN para continuar.
          </Text>

          <TouchableOpacity style={styles.unlockButton} onPress={promptAuthentication}>
            <Ionicons name="finger-print-outline" size={24} color="#FFFFFF" />
            <Text style={styles.unlockButtonText}>Desbloquear con Biometría / PIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  unlockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    width: '100%',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
  },
  unlockButtonText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: theme.spacing.xs,
  },
})
