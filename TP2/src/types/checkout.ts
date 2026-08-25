export interface CartItem {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  image: any;
  color: string;
  availableColors: string[];
  size: string;
  availableSizes: string[];
  quantity: number;
}

export type CardType = 'visa' | 'mastercard' | 'amex' | 'other';

export interface PaymentForm {
  cardType: CardType;
  cardHolder: string;
  cardNumber: string;
  expMonth: string;
  expYear: string;
  cvv: string;
}

export interface ShippingAddress {
  street: string;
  city: string;
  zipCode: string;
  country: string;
}
