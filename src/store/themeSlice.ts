import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { BaseStyle } from "../types/admin/admin.types";

interface ThemeState {
  mode: "light" | "dark";
  baseStyle: BaseStyle;
  defaultBackgroundColor: string;
}

const initialState: ThemeState = {
  mode: "light",
  baseStyle: { fontSize: "14px", color: "#333333" },
  defaultBackgroundColor: "#ffffff",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleMode(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setBaseStyle(state, action: PayloadAction<BaseStyle>) {
      state.baseStyle = action.payload;
    },
    setBackground(state, action: PayloadAction<string>) {
      state.defaultBackgroundColor = action.payload;
    },
  },
});

export const { toggleMode, setBaseStyle, setBackground } = themeSlice.actions;
export default themeSlice.reducer;
