import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Search {
  searchInput: string;
  searchToggle: boolean;
}

const initialState : Search = {
  searchInput: "",
  searchToggle: false,
};

export const searchSlice = createSlice({
  name: "searchSlice",
  initialState,
  reducers: {
    setSearchInput: (state, action: PayloadAction<string>) => {
      state.searchInput = action.payload;
    },
    setSearchToggle: (state, action: PayloadAction<boolean>) => {
      state.searchToggle = action.payload;
    },
  },
});

export const { setSearchInput, setSearchToggle } = searchSlice.actions;
export default searchSlice.reducer;
