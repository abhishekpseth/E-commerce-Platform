import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  cartSize: number;
}

const initialState: CartState = {
  cartSize: 0,
};

export const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    setCartSize: (state, action: PayloadAction<number>) => {
      state.cartSize = action.payload;
    },
  },
});

export const { setCartSize } = cartSlice.actions;
export default cartSlice.reducer;