import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { theme } from '../theme/theme'

interface HeaderIllustrationProps {
  iconName: keyof typeof Ionicons.glyphMap
}

export const HeaderIllustration: React.FC<HeaderIllustrationProps> = ({ iconName }) => {
  return (
    <View style={styles.container}>
      {/* Círculo Central con fondo violeta claro #F2F1F9 */}
      <View style={styles.outerCircle}>
        <View style={styles.innerCircle}>
          <Ionicons name={iconName} size={36} color={theme.colors.primary} />
        </View>
      </View>

      {/* Puntos decorativos flotantes de colores del Figma */}
      <View style={[styles.dot, styles.dotRed]} />
      <View style={[styles.dot, styles.dotYellow]} />
      <View style={[styles.dot, styles.dotCyan]} />
      <View style={[styles.dot, styles.dotBlue]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.spacing.md,
    height: 110,
    width: 110,
    alignSelf: 'center',
  },
  outerCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#F2F1F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(40, 28, 157, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    position: 'absolute',
    borderRadius: 999,
  },
  dotRed: {
    width: 12,
    height: 12,
    backgroundColor: '#FF4267',
    top: 14,
    right: 4,
  },
  dotYellow: {
    width: 10,
    height: 10,
    backgroundColor: '#FFAF2A',
    bottom: 12,
    left: 2,
  },
  dotCyan: {
    width: 8,
    height: 8,
    backgroundColor: '#52D5BA',
    top: 24,
    left: 8,
  },
  dotBlue: {
    width: 10,
    height: 10,
    backgroundColor: '#0890FE',
    bottom: 20,
    right: 8,
  },
})
