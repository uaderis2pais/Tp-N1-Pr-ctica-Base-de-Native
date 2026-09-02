import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  StyleSheet,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { theme } from '../../theme/theme'

interface CustomInputProps extends TextInputProps {
  label?: string
  error?: string
  leftIcon?: keyof typeof Ionicons.glyphMap
  isPassword?: boolean
  disabled?: boolean
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  error,
  leftIcon,
  isPassword = false,
  disabled = false,
  style,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isEditable = !disabled && props.editable !== false

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          !!error && styles.inputWrapperError,
          !isEditable && styles.inputWrapperDisabled,
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon}
            size={20}
            color={
              error
                ? theme.colors.error
                : isFocused
                ? theme.colors.primary
                : theme.colors.textMuted
            }
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            !isEditable && styles.inputDisabled,
            style,
          ]}
          placeholderTextColor={theme.colors.textMuted}
          editable={isEditable}
          secureTextEntry={isPassword && !showPassword}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            disabled={!isEditable}
            style={styles.eyeIcon}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
    width: '100%',
  },
  label: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.inputBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    height: 52,
  },
  inputWrapperFocused: {
    borderColor: theme.colors.primary,
    borderWidth: 1.5,
  },
  inputWrapperError: {
    borderColor: theme.colors.error,
    borderWidth: 1.5,
    backgroundColor: theme.colors.errorBg,
  },
  inputWrapperDisabled: {
    backgroundColor: theme.colors.inputDisabled,
    borderColor: theme.colors.borderLight,
    opacity: 0.6,
  },
  leftIcon: {
    marginRight: theme.spacing.sm,
  },
  eyeIcon: {
    padding: theme.spacing.xs,
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.medium,
    color: theme.colors.text,
    fontSize: 15,
    paddingVertical: 0,
  },
  inputDisabled: {
    color: theme.colors.textDisabled,
  },
  errorText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
})
