import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { CartItem } from '@/types/checkout';

interface CartItemRowProps {
  item: CartItem;
  onUpdateItem: (updated: CartItem) => void;
  onDeleteItem: (id: string) => void;
}

export function CartItemRow({ item, onUpdateItem, onDeleteItem }: CartItemRowProps) {
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [sizeModalVisible, setSizeModalVisible] = useState(false);

  const handleIncrement = () => {
    onUpdateItem({ ...item, quantity: item.quantity + 1 });
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateItem({ ...item, quantity: item.quantity - 1 });
    } else {
      onDeleteItem(item.id);
    }
  };

  const handleSelectColor = (color: string) => {
    onUpdateItem({ ...item, color });
    setColorModalVisible(false);
  };

  const handleSelectSize = (size: string) => {
    onUpdateItem({ ...item, size });
    setSizeModalVisible(false);
  };

  return (
    <View style={styles.card}>
      {/* Visual Header / Title & Pricing */}
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productSubtitle}>{item.subtitle}</Text>
        </View>
        <View style={styles.priceContainer}>
          {item.originalPrice && (
            <Text style={styles.originalPrice}>${item.originalPrice.toFixed(2)}</Text>
          )}
          <Text style={styles.currentPrice}>${item.price.toFixed(2)}</Text>
        </View>
      </View>

      {/* Main Row: Thumbnail + Option Controls */}
      <View style={styles.mainRow}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.image} resizeMode="contain" />
        </View>

        {/* Option Selectors: Color, Size, Qty */}
        <View style={styles.controlsContainer}>
          {/* Color Selector */}
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Color</Text>
            <Pressable
              onPress={() => setColorModalVisible(true)}
              style={({ pressed }) => [styles.selectBox, pressed && styles.pressed]}>
              <Text style={styles.selectBoxText}>{item.color}</Text>
              <Text style={styles.dropdownChevron}>⌵</Text>
            </Pressable>
          </View>

          {/* Size Selector */}
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Size</Text>
            <Pressable
              onPress={() => setSizeModalVisible(true)}
              style={({ pressed }) => [styles.selectBox, pressed && styles.pressed]}>
              <Text style={styles.selectBoxText}>{item.size}</Text>
              <Text style={styles.dropdownChevron}>⌵</Text>
            </Pressable>
          </View>

          {/* Qty Controls */}
          <View style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>Qty</Text>
            <View style={styles.stepperContainer}>
              {/* Trash / Decrement Button */}
              <Pressable
                onPress={handleDecrement}
                style={({ pressed }) => [styles.stepperBtn, pressed && styles.pressed]}>
                <Text style={styles.trashIcon}>🗑️</Text>
              </Pressable>

              {/* Quantity Number */}
              <Text style={styles.quantityText}>{item.quantity}</Text>

              {/* Plus Button */}
              <Pressable
                onPress={handleIncrement}
                style={({ pressed }) => [styles.stepperBtn, pressed && styles.pressed]}>
                <Text style={styles.plusIcon}>+</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* Color Selection Modal */}
      <Modal visible={colorModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Color</Text>
              <Pressable onPress={() => setColorModalVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </Pressable>
            </View>
            <FlatList
              data={item.availableColors}
              keyExtractor={(col) => col}
              renderItem={({ item: col }) => (
                <Pressable
                  onPress={() => handleSelectColor(col)}
                  style={[
                    styles.modalOption,
                    col === item.color && styles.modalOptionSelected,
                  ]}>
                  <Text
                    style={[
                      styles.modalOptionText,
                      col === item.color && styles.modalOptionTextSelected,
                    ]}>
                    {col}
                  </Text>
                  {col === item.color && <Text style={styles.checkmark}>✓</Text>}
                </Pressable>
              )}
            />
          </SafeAreaView>
        </View>
      </Modal>

      {/* Size Selection Modal */}
      <Modal visible={sizeModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Seleccionar Talle / Size</Text>
              <Pressable onPress={() => setSizeModalVisible(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </Pressable>
            </View>
            <FlatList
              data={item.availableSizes}
              keyExtractor={(sz) => sz}
              renderItem={({ item: sz }) => (
                <Pressable
                  onPress={() => handleSelectSize(sz)}
                  style={[
                    styles.modalOption,
                    sz === item.size && styles.modalOptionSelected,
                  ]}>
                  <Text
                    style={[
                      styles.modalOptionText,
                      sz === item.size && styles.modalOptionTextSelected,
                    ]}>
                    {sz}
                  </Text>
                  {sz === item.size && <Text style={styles.checkmark}>✓</Text>}
                </Pressable>
              )}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  productSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    fontSize: 13,
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  mainRow: {
    flexDirection: 'row',
    gap: 16,
  },
  imageContainer: {
    width: 140,
    height: 140,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  controlsContainer: {
    flex: 1,
    gap: 10,
    justifyContent: 'center',
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  selectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minWidth: 100,
  },
  selectBoxText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
  },
  dropdownChevron: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 6,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 4,
    minWidth: 100,
    justifyContent: 'space-between',
  },
  stepperBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  trashIcon: {
    fontSize: 14,
  },
  plusIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },
  pressed: {
    opacity: 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  closeBtn: {
    fontSize: 18,
    color: '#64748b',
    padding: 4,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 6,
  },
  modalOptionSelected: {
    backgroundColor: '#eff6ff',
  },
  modalOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  modalOptionTextSelected: {
    color: '#2563eb',
    fontWeight: '700',
  },
  checkmark: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '700',
  },
});
