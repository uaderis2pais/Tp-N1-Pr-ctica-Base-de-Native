import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import * as LocalAuthentication from 'expo-local-authentication'
import { Ionicons } from '@expo/vector-icons'
import { theme } from '../theme/theme'

interface BiometricAuthCardProps {
  onSuccess?: () => void
  title?: string
}

export const BiometricAuthCard: React.FC<BiometricAuthCardProps> = ({
  onSuccess,
  title = 'Autenticación Biométrica / PIN',
}) => {
  const [isAvailable, setIsAvailable] = useState(false)
  const [biometricType, setBiometricType] = useState<string>('Biometría')

  useEffect(() => {
    checkAvailability()
  }, [])

  const checkAvailability = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync()
      const isEnrolled = await LocalAuthentication.isEnrolledAsync()

      if (hasHardware && isEnrolled) {
        setIsAvailable(true)
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync()

        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          setBiometricType('Face ID')
        } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          setBiometricType('Huella Dactilar')
        } else {
          setBiometricType('PIN / Biometría')
        }
      } else {
        setIsAvailable(false)
      }
    } catch (e) {
      setIsAvailable(false)
    }
  }

  const handleAuthenticate = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentícate en iBank',
        cancelLabel: 'Cancelar',
        fallbackLabel: 'Usar contraseña',
        disableDeviceFallback: false,
      })

      if (result.success) {
        Alert.alert('¡Autenticado!', `${biometricType} verificado correctamente.`)
        if (onSuccess) onSuccess()
      } else {
        if (result.error !== 'user_cancel') {
          Alert.alert('Error', 'No se pudo verificar la identidad biométrica.')
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Ocurrió un fallo al intentar la autenticación biométrica.')
    }
  }

  if (!isAvailable) {
    return (
      <View style={styles.cardDisabled}>
        <Ionicons name="shield-outline" size={24} color={theme.colors.textMuted} />
        <Text style={styles.textDisabled}>
          Biometría / PIN local disponible al configurar bloqueo en el dispositivo.
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.card}>
      <View style={styles.leftSection}>
        <Ionicons name="finger-print-outline" size={28} color={theme.colors.primary} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Verificar identidad con {biometricType}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.authButton} onPress={handleAuthenticate}>
        <Text style={styles.authButtonText}>Ingresar</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary + '20',
    marginVertical: theme.spacing.md,
  },
  cardDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginVertical: theme.spacing.md,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  title: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 14,
    color: theme.colors.primary,
  },
  subtitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  textDisabled: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.textMuted,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  authButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
  },
  authButtonText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 12,
    color: '#FFFFFF',
  },
})
