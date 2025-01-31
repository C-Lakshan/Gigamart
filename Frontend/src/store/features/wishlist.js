import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: [],
  reducers: {
    addToWishlist: (state, action) => {
      const existing = state.find(item => item.productId === action.payload.productId);
      if (!existing) {
        state.push(action.payload);
      }
    },
    removeFromWishlist: (state, action) => {
      return state.filter(item => item.productId !== action.payload);
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export const selectWishListItems = (state) => state.wishlist;
export const countWishlistItems = (state) => state.wishlist?.length || 0;
export default wishlistSlice.reducer;
