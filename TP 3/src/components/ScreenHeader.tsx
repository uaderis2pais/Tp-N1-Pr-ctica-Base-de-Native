import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { theme } from '../theme/theme'

interface ScreenHeaderProps {
  title: string
  onBack?: () => void
  showBack?: boolean
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  onBack,
  showBack = true,
}) => {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <View style={styles.headerBackground}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          {showBack ? (
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              <Text style={styles.titleText}>{title}</Text>
            </TouchableOpacity>
          ) : (
            <Text style={[styles.titleText, { marginLeft: theme.spacing.md }]}>
              {title}
            </Text>
          )}
        </View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  headerBackground: {
    backgroundColor: theme.colors.primary,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight || 20 : 0,
  },
  safeArea: {
    backgroundColor: theme.colors.primary,
  },
  headerRow: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  titleText: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: theme.spacing.xs,
  },
})
