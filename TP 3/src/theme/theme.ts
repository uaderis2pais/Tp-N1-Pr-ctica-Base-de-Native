export const theme = {
  colors: {
    // Paleta Principal Figma iBank
    primary: '#281C9D',
    primaryMedium: '#5655B9',
    primaryMuted: '#A8A3D7',
    primaryLight: '#F2F1F9',

    // Superficies y Fondos
    background: '#F8F9FD',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    inputBackground: '#FFFFFF',
    inputDisabled: '#F5F6FA',

    // Textos
    text: '#343434',
    textSecondary: '#898989',
    textMuted: '#989898',
    textDisabled: '#A8A3D7',

    // Bordes
    border: '#E0E0E0',
    borderLight: '#CACACA',
    borderFocused: '#281C9D',
    borderError: '#FF4267',

    // Colores Semánticos
    error: '#FF4267',
    errorBg: 'rgba(255, 66, 103, 0.08)',
    success: '#52D5BA',
    successBg: 'rgba(82, 213, 186, 0.12)',
    warning: '#FFAF2A',
    warningBg: 'rgba(255, 175, 42, 0.12)',
    info: '#0890FE',
    infoBg: 'rgba(8, 144, 254, 0.12)',

    // Estados de Botón
    buttonDisabledBg: '#F2F1F9',
    buttonDisabledText: '#A8A3D7',
  },

  fonts: {
    regular: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semiBold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  shadows: {
    card: {
      shadowColor: '#3629B7',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.07,
      shadowRadius: 15,
      elevation: 4,
    },
    button: {
      shadowColor: '#281C9D',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 3,
    },
  },
}
