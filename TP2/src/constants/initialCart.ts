import { CartItem } from '@/types/checkout';

export const INITIAL_CART_ITEMS: CartItem[] = [
  {
    id: 'nike-court-lite-2',
    name: 'NikeCourt Lite 2',
    subtitle: "Women's Hard Court Tennis Shoe",
    price: 67.00,
    image: require('../../assets/images/nike-shoe.png'),
    color: 'Blue',
    availableColors: ['Blue', 'White', 'Pink', 'Black'],
    size: '38 EU',
    availableSizes: ['36 EU', '37 EU', '38 EU', '39 EU', '40 EU'],
    quantity: 1,
  },
  {
    id: 'wilson-hammer-53',
    name: 'Wilson Hammer 5.3',
    subtitle: 'Adult Tennis Racket',
    price: 80.45,
    originalPrice: 99.95,
    image: require('../../assets/images/wilson-racket.png'),
    color: 'Black',
    availableColors: ['Black', 'White/Red', 'Blue'],
    size: '2-1/4',
    availableSizes: ['2-1/4', '4-1/4', '4-3/8', '4-1/2'],
    quantity: 1,
  },
];
