import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ImageSourcePropType } from 'react-native';

/**
 * A single line item in the local cart. `image` mirrors the product image
 * source used elsewhere (either a remote { uri } or a bundled asset).
 */
export interface CartItem {
  productId: string | number;
  name: string;
  description: string;
  image: ImageSourcePropType;
  size: string;
  price: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Adds an item to the cart. If the same product + size already exists,
     * its quantity is increased instead of creating a duplicate row.
     */
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const incoming = action.payload;
      const existing = state.items.find(
        i => i.productId === incoming.productId && i.size === incoming.size,
      );
      if (existing) {
        existing.quantity += incoming.quantity;
      } else {
        state.items.push(incoming);
      }
    },
    removeFromCart: (
      state,
      action: PayloadAction<{ productId: string | number; size: string }>,
    ) => {
      state.items = state.items.filter(
        i =>
          !(
            i.productId === action.payload.productId &&
            i.size === action.payload.size
          ),
      );
    },
    clearCart: state => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
