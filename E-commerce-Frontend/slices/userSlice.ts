import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Address } from "../src/types/User";

interface User {
  addressObject: Address | null;
}

const initialState : User = {
  addressObject: null
};

export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setAddressObject: (state, action : PayloadAction<Address | null>) => {
      state.addressObject = action.payload;
    },
  },
});

export const { setAddressObject } = userSlice.actions;
export default userSlice.reducer;
