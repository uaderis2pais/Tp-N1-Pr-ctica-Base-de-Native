import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  Image,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CartItem, CardType, ShippingAddress } from '@/types/checkout';

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const totalPrice = params.totalPrice ? String(params.totalPrice) : '0.00';
  const totalItems = params.totalItems ? String(params.totalItems) : '0';
  const cartDataRaw = params.cartData ? String(params.cartData) : '[]';

  let cartItems: CartItem[] = [];
  try {
    cartItems = JSON.parse(cartDataRaw);
  } catch (e) {
    cartItems = [];
  }

  // State Requirement 3: Card Types (Visa, MasterCard, Amex, Other)
  const [selectedCardType, setSelectedCardType] = useState<CardType>('visa');

  // Payment Form Fields
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expMonth, setExpMonth] = useState('');
  const [expYear, setExpYear] = useState('');
  const [cvv, setCvv] = useState('');

  // Shipping Address State & Modal
  const [address, setAddress] = useState<ShippingAddress | null>(null);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [streetInput, setStreetInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [zipInput, setZipInput] = useState('');
  const [countryInput, setCountryInput] = useState('');

  // Info modals
  const [cvvInfoVisible, setCvvInfoVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    if (cleaned.length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleSaveAddress = () => {
    if (!streetInput.trim() || !cityInput.trim()) {
      Alert.alert('Atención', 'Por favor ingresa la calle y ciudad.');
      return;
    }
    setAddress({
      street: streetInput.trim(),
      city: cityInput.trim(),
      zipCode: zipInput.trim(),
      country: countryInput.trim() || 'Argentina',
    });
    setAddressModalVisible(false);
  };

  const handlePayNow = () => {
    if (!cardHolder.trim()) {
      Alert.alert('Campo Requerido', 'Por favor ingresa el nombre del titular de la tarjeta.');
      return;
    }
    if (cardNumber.replace(/\s/g, '').length < 15) {
      Alert.alert('Tarjeta Inválida', 'Por favor ingresa un número de tarjeta válido (16 dígitos).');
      return;
    }
    if (!expMonth || !expYear) {
      Alert.alert('Fecha de Expiración', 'Por favor ingresa mes y año de vencimiento.');
      return;
    }
    if (cvv.length < 3) {
      Alert.alert('Código de Seguridad', 'Por favor ingresa los 3 dígitos del CVV.');
      return;
    }

    setSuccessModalVisible(true);
  };

  const handleFinishPurchase = () => {
    setSuccessModalVisible(false);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.contentWrapper}>
        {/* Navigation Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backBtnText}>‹</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Secure Payment</Text>
          <View style={styles.secureBadge}>
            <Text style={styles.secureBadgeText}>🔒 SECURE</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Shipping Section */}
          <Text style={styles.sectionHeader}>Shipping</Text>
          <Pressable
            onPress={() => setAddressModalVisible(true)}
            style={({ pressed }) => [styles.addressCard, pressed && styles.pressed]}>
            <Text style={styles.shippingIcon}>🚚</Text>
            <View style={styles.addressInfo}>
              <Text style={styles.addressTitle}>
                {address ? `${address.street}, ${address.city}` : 'Add Address'}
              </Text>
              {address && (
                <Text style={styles.addressSubtext}>
                  {address.zipCode} {address.country}
                </Text>
              )}
            </View>
            <Text style={styles.arrowChevron}>›</Text>
          </Pressable>

          {/* Payment Section */}
          <Text style={styles.sectionHeader}>Payment</Text>
          <View style={styles.paymentCardContainer}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderIcon}>💳</Text>
              <Text style={styles.cardHeaderTitle}>Add Credit / Debit Card</Text>
            </View>

            {/* Requirement 3: Card Types Options (Visa, MasterCard, Amex, Other) */}
            <Text style={styles.cardTypeLabel}>Selecciona el Tipo de Tarjeta:</Text>
            <View style={styles.cardTypeTabsRow}>
              {(
                [
                  { type: 'visa', label: 'Visa', icon: '💳' },
                  { type: 'mastercard', label: 'MasterCard', icon: '🔴🟡' },
                  { type: 'amex', label: 'Amex', icon: '🟦' },
                  { type: 'other', label: 'Otros', icon: '🌐' },
                ] as const
              ).map((item) => {
                const isSelected = selectedCardType === item.type;
                return (
                  <Pressable
                    key={item.type}
                    onPress={() => setSelectedCardType(item.type)}
                    style={[
                      styles.cardTypeChip,
                      isSelected && styles.cardTypeChipSelected,
                    ]}>
                    <Text style={styles.cardTypeChipIcon}>{item.icon}</Text>
                    <Text
                      style={[
                        styles.cardTypeChipText,
                        isSelected && styles.cardTypeChipTextSelected,
                      ]}>
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Cardholder Name */}
            <TextInput
              style={styles.inputField}
              placeholder="Card Holder's Name"
              placeholderTextColor="#94a3b8"
              value={cardHolder}
              onChangeText={setCardHolder}
            />

            {/* Card Number */}
            <TextInput
              style={styles.inputField}
              placeholder="Card Number"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={handleCardNumberChange}
            />

            {/* Expire Date Row */}
            <Text style={styles.inputSubLabel}>Expire Date</Text>
            <View style={styles.rowTwoFields}>
              <TextInput
                style={[styles.inputField, styles.halfInput]}
                placeholder="Month (MM)"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                maxLength={2}
                value={expMonth}
                onChangeText={setExpMonth}
              />
              <TextInput
                style={[styles.inputField, styles.halfInput]}
                placeholder="Year (YY)"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                maxLength={2}
                value={expYear}
                onChangeText={setExpYear}
              />
            </View>

            {/* Security Code (CVV) */}
            <View style={styles.cvvRow}>
              <TextInput
                style={[styles.inputField, { flex: 1 }]}
                placeholder="Security Code"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
                value={cvv}
                onChangeText={setCvv}
              />
              <Pressable
                onPress={() => setCvvInfoVisible(true)}
                style={styles.infoIconBtn}>
                <Text style={styles.infoIconText}>ⓘ</Text>
              </Pressable>
            </View>
          </View>

          {/* Order Summary Horizontal Carousel */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryHeaderRow}>
              <Text style={styles.summaryTag}>{totalItems} items</Text>
              <View style={styles.deliveryBadge}>
                <Text style={styles.deliveryBadgeText}>Arrives by April 3 to April 9th</Text>
              </View>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.summaryScrollContent}>
              {cartItems.map((item) => (
                <View key={item.id} style={styles.summaryProductCard}>
                  <Image source={item.image} style={styles.summaryImage} resizeMode="contain" />
                  <View style={styles.summaryDetails}>
                    <Text style={styles.summaryProductName}>{item.name}</Text>
                    <Text style={styles.summaryProductSub}>Color: {item.color}</Text>
                    <Text style={styles.summaryProductSub}>Size: {item.size}</Text>
                    <Text style={styles.summaryProductSub}>Qty: {item.quantity}</Text>
                  </View>
                  <Text style={styles.summaryPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        {/* Bottom Pay Now Bar */}
        <View style={styles.footerContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.chevronUp}>^</Text>
            <View>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalAmount}>${totalPrice}</Text>
            </View>
          </View>

          <Pressable
            onPress={handlePayNow}
            style={({ pressed }) => [styles.payNowBtn, pressed && styles.pressed]}>
            <Text style={styles.payNowBtnText}>Pay Now</Text>
          </Pressable>
        </View>

        {/* Footer Note */}
        <Text style={styles.footerNote}>
          This is the final step, after you touch Pay Now button, the payment will be processed
        </Text>

        {/* Address Modal */}
        <Modal visible={addressModalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Agregar Dirección de Envío</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Calle y Número (ej. Av. Corrientes 1234)"
                placeholderTextColor="#94a3b8"
                value={streetInput}
                onChangeText={setStreetInput}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Ciudad / Localidad"
                placeholderTextColor="#94a3b8"
                value={cityInput}
                onChangeText={setCityInput}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Código Postal"
                placeholderTextColor="#94a3b8"
                value={zipInput}
                onChangeText={setZipInput}
              />
              <TextInput
                style={styles.modalInput}
                placeholder="País (ej. Argentina)"
                placeholderTextColor="#94a3b8"
                value={countryInput}
                onChangeText={setCountryInput}
              />

              <View style={styles.modalBtnRow}>
                <Pressable
                  onPress={() => setAddressModalVisible(false)}
                  style={[styles.modalBtn, styles.modalCancelBtn]}>
                  <Text style={styles.modalCancelText}>Cancelar</Text>
                </Pressable>
                <Pressable
                  onPress={handleSaveAddress}
                  style={[styles.modalBtn, styles.modalSaveBtn]}>
                  <Text style={styles.modalSaveText}>Guardar</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* CVV Info Modal */}
        <Modal visible={cvvInfoVisible} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.infoModalCard}>
              <Text style={styles.infoModalTitle}>ⓘ Security Code (CVV)</Text>
              <Text style={styles.infoModalText}>
                El código CVV es el número de seguridad de 3 o 4 dígitos ubicado en el reverso de tu tarjeta ({selectedCardType.toUpperCase()}).
              </Text>
              <Pressable
                onPress={() => setCvvInfoVisible(false)}
                style={styles.infoModalBtn}>
                <Text style={styles.infoModalBtnText}>Entendido</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        {/* Success Payment Confirmation Modal */}
        <Modal visible={successModalVisible} animationType="fade" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.successModalCard}>
              <Text style={styles.successEmoji}>🎉</Text>
              <Text style={styles.successTitle}>¡Pago Realizado con Éxito!</Text>
              <Text style={styles.successSub}>
                Tu orden ha sido procesada de manera segura.
              </Text>

              <View style={styles.receiptBox}>
                <Text style={styles.receiptText}>
                  • Tarjeta: {selectedCardType.toUpperCase()} ({cardNumber ? `**** ${cardNumber.slice(-4)}` : '**** 9010'})
                </Text>
                <Text style={styles.receiptText}>• Total Pagado: ${totalPrice}</Text>
                {address && (
                  <Text style={styles.receiptText}>
                    • Envió a: {address.street}, {address.city}
                  </Text>
                )}
              </View>

              <Pressable
                onPress={handleFinishPurchase}
                style={styles.finishBtn}>
                <Text style={styles.finishBtnText}>Volver a la Tienda 🛒</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentWrapper: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backBtn: {
    paddingRight: 12,
    paddingVertical: 4,
  },
  backBtnText: {
    fontSize: 28,
    color: '#2563eb',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  secureBadge: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  secureBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 8,
    marginBottom: 10,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  shippingIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  addressInfo: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  addressSubtext: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  arrowChevron: {
    fontSize: 20,
    color: '#94a3b8',
  },
  paymentCardContainer: {
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  cardHeaderIcon: {
    fontSize: 20,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  cardTypeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  cardTypeTabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  cardTypeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingVertical: 8,
    gap: 4,
  },
  cardTypeChipSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
    borderWidth: 2,
  },
  cardTypeChipIcon: {
    fontSize: 12,
  },
  cardTypeChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  cardTypeChipTextSelected: {
    color: '#2563eb',
    fontWeight: '700',
  },
  inputField: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 12,
  },
  inputSubLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 6,
  },
  rowTwoFields: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  cvvRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoIconBtn: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
  },
  infoIconText: {
    fontSize: 18,
    color: '#38A1E9',
  },
  summaryContainer: {
    marginTop: 8,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryTag: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  deliveryBadge: {
    backgroundColor: '#FFFBE6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deliveryBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#78350f',
  },
  summaryScrollContent: {
    gap: 12,
  },
  summaryProductCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 12,
    width: 260,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    gap: 10,
  },
  summaryImage: {
    width: 60,
    height: 60,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  summaryDetails: {
    flex: 1,
  },
  summaryProductName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  summaryProductSub: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },
  summaryPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },
  footerContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  footerNote: {
    position: 'absolute',
    bottom: 8,
    left: 16,
    right: 16,
    fontSize: 10,
    color: '#94a3b8',
    textAlign: 'center',
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chevronUp: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '800',
  },
  totalLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  totalAmount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  payNowBtn: {
    backgroundColor: '#8AC7EE',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payNowBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    gap: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  modalCancelBtn: {
    backgroundColor: '#f1f5f9',
  },
  modalCancelText: {
    color: '#64748b',
    fontWeight: '600',
  },
  modalSaveBtn: {
    backgroundColor: '#2563eb',
  },
  modalSaveText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  infoModalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    maxWidth: 340,
    alignItems: 'center',
  },
  infoModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  infoModalText: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  infoModalBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  infoModalBtnText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  successModalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 28,
    maxWidth: 380,
    width: '100%',
    alignItems: 'center',
  },
  successEmoji: {
    fontSize: 54,
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 6,
  },
  successSub: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 20,
  },
  receiptBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginBottom: 24,
    gap: 6,
  },
  receiptText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  finishBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '100%',
    alignItems: 'center',
  },
  finishBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
