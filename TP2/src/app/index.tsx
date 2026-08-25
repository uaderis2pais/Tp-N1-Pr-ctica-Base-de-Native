import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { INITIAL_CART_ITEMS } from '@/constants/initialCart';
import { CartItem } from '@/types/checkout';
import { CartItemRow } from '@/components/cart-item';

export default function CartScreen() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART_ITEMS);

  // Recalculate total items and price
  const totalItemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleUpdateItem = (updated: CartItem) => {
    setItems((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleResetDemo = () => {
    setItems(INITIAL_CART_ITEMS);
  };

  const handleGoToCheckout = () => {
    if (items.length === 0) return;
    router.push({
      pathname: '/payment',
      params: {
        totalPrice: totalPrice.toFixed(2),
        totalItems: totalItemCount.toString(),
        cartData: JSON.stringify(items),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.contentWrapper}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <Text style={styles.headerSubtitle}>
            {totalItemCount} {totalItemCount === 1 ? 'item' : 'items'} - Total ${totalPrice.toFixed(2)}
          </Text>
        </View>

        {/* Banner: Arrives by April 3 to April 9th */}
        <View style={styles.shippingBanner}>
          <Text style={styles.shippingIcon}>🚚</Text>
          <Text style={styles.shippingText}>Arrives by April 3 to April 9th</Text>
        </View>

        {/* Product List */}
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CartItemRow
              item={item}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>🛒</Text>
              <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
              <Text style={styles.emptySubtitle}>
                Has eliminado todos los productos. Puedes restablecerlos para continuar probando el flujo de compra.
              </Text>
              <Pressable
                onPress={handleResetDemo}
                style={({ pressed }) => [styles.resetBtn, pressed && styles.pressed]}>
                <Text style={styles.resetBtnText}>🔄 Restablecer Productos Demo</Text>
              </Pressable>
            </View>
          }
        />

        {/* Bottom Bar: Total & Checkout Button */}
        {items.length > 0 && (
          <View style={styles.footerContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.chevronUp}>^</Text>
              <View>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>${totalPrice.toFixed(2)}</Text>
              </View>
            </View>

            <Pressable
              onPress={handleGoToCheckout}
              style={({ pressed }) => [styles.checkoutBtn, pressed && styles.pressed]}>
              <Text style={styles.checkoutBtnText}>Checkout</Text>
            </Pressable>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentWrapper: {
    flex: 1,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  shippingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFBE6',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  shippingIcon: {
    fontSize: 16,
  },
  shippingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#451a03',
  },
  listContent: {
    padding: 16,
    paddingBottom: 110,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
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
  checkoutBtn: {
    backgroundColor: '#38A1E9',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyEmoji: {
    fontSize: 54,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  resetBtn: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  resetBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
});
