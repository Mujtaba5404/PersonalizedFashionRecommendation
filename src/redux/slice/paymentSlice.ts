import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * A saved payment card. The full number/expiry/cvv are kept so the checkout
 * API can be called without re-entering them; `last4` is derived for display.
 */
export interface SavedCard {
  id: number;
  name: string;
  number: string;
  expiry: string;
  cvv: string;
  last4: string;
}

interface PaymentState {
  cards: SavedCard[];
  selectedCardId: number | null;
}

const initialState: PaymentState = {
  cards: [],
  selectedCardId: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    addCard: (state, action: PayloadAction<SavedCard>) => {
      state.cards.push(action.payload);
      state.selectedCardId = action.payload.id;
    },
    removeCard: (state, action: PayloadAction<number>) => {
      state.cards = state.cards.filter(c => c.id !== action.payload);
      if (state.selectedCardId === action.payload) {
        state.selectedCardId = state.cards.length ? state.cards[0].id : null;
      }
    },
    selectCard: (state, action: PayloadAction<number>) => {
      state.selectedCardId = action.payload;
    },
  },
});

export const { addCard, removeCard, selectCard } = paymentSlice.actions;

export default paymentSlice.reducer;
