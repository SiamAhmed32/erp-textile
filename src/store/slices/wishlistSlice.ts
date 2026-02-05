import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/**
 * EXAMPLE: Wishlist Slice
 * 
 * This is an example implementation of a user wishlist/favorites feature.
 * Commonly used in e-commerce applications. Remove if not needed.
 * 
 * Features:
 * - Add/remove items from wishlist
 * - Persistent storage via localStorage
 * - Duplicate prevention
 */

const WISHLIST_NAME = "APP_WISHLIST";

// Load wishlist from localStorage
const loadStateFromLocalStorage = (): WishlistState => {
  if (typeof window !== "undefined") {
    try {
      const storedState = localStorage.getItem(WISHLIST_NAME);
      return storedState ? JSON.parse(storedState) : { items: [] };
    } catch (error) {
      console.error("Error loading wishlist from localStorage:", error);
      return { items: [] };
    }
  }
  return { items: [] };
};

// Save wishlist to localStorage
const saveStateToLocalStorage = (state: WishlistState) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(WISHLIST_NAME, JSON.stringify(state));
    } catch (error) {
      console.error("Error saving wishlist to localStorage:", error);
    }
  }
};

interface WishlistState {
  items: any[];
}

const initialState: WishlistState = loadStateFromLocalStorage();

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState:
    typeof window !== "undefined" && localStorage.getItem(WISHLIST_NAME)
      ? JSON.parse(localStorage.getItem(WISHLIST_NAME)!)
      : initialState,
  reducers: {
    addToWishlist: (state, action: PayloadAction<any>) => {
      const exists = state.items.some(
        (item: any) => item.id === action.payload.id
      );
      if (!exists) {
        state.items = [...state.items, action.payload]; // Avoid direct mutation
        saveStateToLocalStorage(state);
      }
    },
    removeFromWishlist: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (item: any) => item.id !== action.payload
      );
      saveStateToLocalStorage(state);
    },
    clearWishlist: (state) => {
      state.items = [];
      saveStateToLocalStorage(state);
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
