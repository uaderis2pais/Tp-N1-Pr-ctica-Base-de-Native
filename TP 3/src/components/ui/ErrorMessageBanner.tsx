import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { theme } from '../../theme/theme'

interface ErrorMessageBannerProps {
  message: string | null
  type?: 'error' | 'info' | 'success'
}

export const ErrorMessageBanner: React.FC<ErrorMessageBannerProps> = ({
  message,
  type = 'error',
}) => {
  if (!message) return null

  const isError = type === 'error'
  const isSuccess = type === 'success'

  const iconName = isError
    ? 'alert-circle-outline'
    : isSuccess
    ? 'checkmark-circle-outline'
    : 'information-circle-outline'

  const backgroundColor = isError
    ? theme.colors.errorBg
    : isSuccess
    ? theme.colors.successBg
    : theme.colors.warningBg

  const borderColor = isError
    ? theme.colors.error
    : isSuccess
    ? theme.colors.success
    : theme.colors.warning

  const iconColor = borderColor

  return (
    <View style={[styles.banner, { backgroundColor, borderColor }]}>
      <Ionicons name={iconName} size={20} color={iconColor} style={styles.icon} />
      <Text style={styles.text}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    marginBottom: theme.spacing.md,
    width: '100%',
  },
  icon: {
    marginRight: theme.spacing.sm,
  },
  text: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: theme.colors.text,
    flex: 1,
    lineHeight: 18,
  },
})
