import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { theme } from '../../src/theme/theme'
import { useAuth } from '../../src/context/AuthContext'
import { CustomButton } from '../../src/components/ui/CustomButton'

export default function HomeScreen() {
  const { user, signOut } = useAuth()

  const userName =
    user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuario iBank'

  return (
    <View style={styles.root}>
      {/* Header iBank Púrpura #281C9D */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Hola, bienvenido</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>

        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={24} color="#FFFFFF" />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tarjeta de Saldo Principal (Separada del header sin chocarse) */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Disponible</Text>
          <Text style={styles.balanceAmount}>$ 128.450,00</Text>

          <View style={styles.cardFooter}>
            <Text style={styles.cardNumber}>•••• •••• •••• 4291</Text>
            <Text style={styles.cardStatus}>Cuenta Activa</Text>
          </View>
        </View>

        {/* Botones de Acciones Rápidas */}
        <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#E8F0FE' }]}>
              <Ionicons name="send-outline" size={22} color={theme.colors.primary} />
            </View>
            <Text style={styles.actionText}>Transferir</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#E8F8F5' }]}>
              <Ionicons name="qr-code-outline" size={22} color={theme.colors.success} />
            </View>
            <Text style={styles.actionText}>Pagar QR</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#FEF9E7' }]}>
              <Ionicons name="add-circle-outline" size={22} color="#FFAF2A" />
            </View>
            <Text style={styles.actionText}>Cargar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIconContainer, { backgroundColor: '#FADBD8' }]}>
              <Ionicons name="card-outline" size={22} color="#FF4267" />
            </View>
            <Text style={styles.actionText}>Tarjetas</Text>
          </TouchableOpacity>
        </View>

        {/* Actividad Reciente */}
        <Text style={styles.sectionTitle}>Actividad Reciente</Text>
        <View style={styles.transactionsCard}>
          <View style={styles.transactionRow}>
            <View style={styles.transIconCircle}>
              <Ionicons name="cart-outline" size={18} color={theme.colors.primary} />
            </View>
            <View style={styles.transDetails}>
              <Text style={styles.transTitle}>Supermercado Central</Text>
              <Text style={styles.transDate}>Hoy, 14:32 hs</Text>
            </View>
            <Text style={styles.transAmountExpense}>-$ 12.400,00</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.transactionRow}>
            <View style={styles.transIconCircle}>
              <Ionicons name="arrow-down-circle-outline" size={18} color={theme.colors.success} />
            </View>
            <View style={styles.transDetails}>
              <Text style={styles.transTitle}>Transferencia Recibida</Text>
              <Text style={styles.transDate}>Ayer, 09:15 hs</Text>
            </View>
            <Text style={styles.transAmountIncome}>+$ 45.000,00</Text>
          </View>
        </View>

        {/* Detalles de Sesión de Supabase Auth */}
        <View style={styles.sessionDetailsCard}>
          <Text style={styles.sessionTitle}>Información de Sesión</Text>

          <View style={styles.detailRow}>
            <Ionicons name="mail-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>{user?.email}</Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="checkmark-circle-outline" size={16} color={theme.colors.success} />
            <Text style={styles.detailText}>
              Email Confirmado: {user?.email_confirmed_at ? 'Sí' : 'No'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="key-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText} numberOfLines={1}>
              ID: {user?.id}
            </Text>
          </View>
        </View>

        {/* Botón de Cerrar Sesión Ubicado Abajo del Todo */}
        <CustomButton
          title="Cerrar Sesión"
          variant="outline"
          onPress={signOut}
          style={styles.signOutButton}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: theme.spacing.xl + 20,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: '#F2F1F9',
  },
  userName: {
    fontFamily: theme.fonts.bold,
    fontSize: 22,
    color: '#FFFFFF',
    marginTop: 2,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.xl * 2,
  },
  balanceCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    shadowColor: '#3629B7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  balanceLabel: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: '#F2F1F9',
  },
  balanceAmount: {
    fontFamily: theme.fonts.bold,
    fontSize: 30,
    color: '#FFFFFF',
    marginVertical: theme.spacing.xs,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  cardNumber: {
    fontFamily: theme.fonts.medium,
    fontSize: 13,
    color: '#F2F1F9',
  },
  cardStatus: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 12,
    color: theme.colors.success,
  },
  sectionTitle: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 16,
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: theme.spacing.xs,
  },
  actionItem: {
    alignItems: 'center',
    width: '22%',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  actionText: {
    fontFamily: theme.fonts.medium,
    fontSize: 12,
    color: theme.colors.text,
  },
  transactionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginVertical: theme.spacing.xs,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  transactionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  transDetails: {
    flex: 1,
  },
  transTitle: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 13,
    color: theme.colors.text,
  },
  transDate: {
    fontFamily: theme.fonts.regular,
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  transAmountExpense: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 13,
    color: theme.colors.error,
  },
  transAmountIncome: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 13,
    color: theme.colors.success,
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: theme.spacing.sm,
  },
  sessionDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sessionTitle: {
    fontFamily: theme.fonts.semiBold,
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  detailText: {
    fontFamily: theme.fonts.regular,
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  signOutButton: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
})
