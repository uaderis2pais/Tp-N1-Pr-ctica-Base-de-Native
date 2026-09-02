import React from 'react'
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { theme } from '../../theme/theme'

interface CustomCheckboxProps {
  checked: boolean
  onToggle: (newValue: boolean) => void
  disabled?: boolean
  error?: string
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  checked,
  onToggle,
  disabled = false,
  error,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={disabled}
        onPress={() => onToggle(!checked)}
        style={styles.checkboxRow}
      >
        <View
          style={[
            styles.checkbox,
            checked && styles.checkboxChecked,
            !!error && styles.checkboxError,
            disabled && styles.checkboxDisabled,
          ]}
        >
          {checked && (
            <Ionicons name="checkmark-sharp" size={14} color="#FFFFFF" />
          )}
        </View>
        <Text style={[styles.label, disabled && styles.labelDisabled]}>
          Al crear una cuenta aceptas nuestros{' '}
          <Text style={styles.termsHighlight}>Términos y Condiciones</Text>
        </Text>
      </TouchableOpacity>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.sm,
    width: '100%',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
    backgroundColor: '#FFFFFF',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkboxError: {
    borderColor: theme.colors.error,
  },
  checkboxDisabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: theme.fonts.regular,
    fontSize: 13,
    color: theme.colors.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  termsHighlight: {
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primary,
  },
  labelDisabled: {
    color: theme.colors.textDisabled,
  },
  errorText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
})
