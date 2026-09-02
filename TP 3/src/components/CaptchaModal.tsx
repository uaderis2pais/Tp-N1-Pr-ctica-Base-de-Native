import React from 'react'
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { WebView } from 'react-native-webview'
import { Ionicons } from '@expo/vector-icons'
import { theme } from '../theme/theme'

interface CaptchaModalProps {
  visible: boolean
  onClose: () => void
  onTokenReceived: (token: string) => void
  siteKey?: string
}

export const CaptchaModal: React.FC<CaptchaModalProps> = ({
  visible,
  onClose,
  onTokenReceived,
  siteKey,
}) => {
  // Priorizar la clave configurada en .env o la de prueba oficial
  const activeSiteKey =
    siteKey ||
    process.env.EXPO_PUBLIC_HCAPTCHA_SITE_KEY ||
    '10000000-ffff-ffff-ffff-000000000001'

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <script src="https://js.hcaptcha.com/1/api.js" async defer></script>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            padding: 0;
            background-color: #FFFFFF;
          }
        </style>
      </head>
      <body>
        <div 
          class="h-captcha" 
          data-sitekey="${activeSiteKey}"
          data-callback="onSuccess"
          data-expired-callback="onExpired">
        </div>

        <script>
          function onSuccess(token) {
            if (token) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'CAPTCHA_SUCCESS', token: token }));
            }
          }
          function onExpired() {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'CAPTCHA_EXPIRED' }));
          }
        </script>
      </body>
    </html>
  `

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data)
      if (data.type === 'CAPTCHA_SUCCESS' && data.token) {
        onTokenReceived(data.token)
        onClose()
      }
    } catch (err) {
      console.warn('Error al procesar mensaje de CAPTCHA WebView:', err)
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Verificación de Seguridad</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close-circle-outline" size={26} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>
            Tildá la casilla "No soy un robot" para verificar tu solicitud.
          </Text>

          <View style={styles.webviewContainer}>
            <WebView
              originWhitelist={['*']}
              source={{ html: htmlContent, baseUrl: 'https://hcaptcha.com' }}
              onMessage={handleMessage}
              style={{ backgroundColor: 'transparent' }}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  modalContent: {
    width: '100%',
    height: '82%',
    maxHeight: 600,
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  modalTitle: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 18,
    color: theme.colors.primary,
  },
  modalSubtitle: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  webviewContainer: {
    flex: 1,
    width: '100%',
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
})
