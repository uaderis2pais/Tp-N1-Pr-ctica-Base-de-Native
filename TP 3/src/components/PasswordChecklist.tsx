import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { theme } from '../theme/theme'
import { checkPasswordRequirements } from '../utils/validators'

interface PasswordChecklistProps {
  password: string
}

export const PasswordChecklist: React.FC<PasswordChecklistProps> = ({ password }) => {
  const status = checkPasswordRequirements(password)

  const items = [
    { key: 'minLength', label: 'Mínimo 8 caracteres', isMet: status.minLength },
    { key: 'hasUppercase', label: 'Al menos una mayúscula (A-Z)', isMet: status.hasUppercase },
    { key: 'hasLowercase', label: 'Al menos una minúscula (a-z)', isMet: status.hasLowercase },
    { key: 'hasNumber', label: 'Al menos un número (0-9)', isMet: status.hasNumber },
    { key: 'hasSymbol', label: 'Al menos un símbolo o carácter especial (!@#$...)', isMet: status.hasSymbol },
  ]

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Requisitos de la contraseña:</Text>
      {items.map((item) => (
        <View key={item.key} style={styles.itemRow}>
          <Ionicons
            name={item.isMet ? 'checkmark-circle' : 'ellipse-outline'}
            size={16}
            color={item.isMet ? theme.colors.success : theme.colors.textMuted}
            style={styles.icon}
          />
          <Text
            style={[
              styles.itemText,
              item.isMet ? styles.itemTextMet : styles.itemTextUnmet,
            ]}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F9FD',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  icon: {
    marginRight: theme.spacing.xs + 2,
  },
  itemText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
  },
  itemTextMet: {
    color: theme.colors.success,
  },
  itemTextUnmet: {
    color: theme.colors.textMuted,
  },
})
