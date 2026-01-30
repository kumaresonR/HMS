import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MinimizedPage {
  route: string;
  pageName: string;
  data?: any; // Store any page-specific data
}

interface UIState {
  minimizedPages: MinimizedPage[];
}

const initialState: UIState = {
  minimizedPages: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    minimizePage: (state, action: PayloadAction<MinimizedPage>) => {
      const existingPage = state.minimizedPages.find((p) => p.route === action.payload.route);
      if (!existingPage) {
        state.minimizedPages.push(action.payload);
      } else {
        // Update existing page data
        existingPage.data = action.payload.data;
      }
    },
    restorePage: (state, action: PayloadAction<string>) => {
      state.minimizedPages = state.minimizedPages.filter((p) => p.route !== action.payload);
    },

    removeMinimizedPage: (state, action: PayloadAction<string>) => {
      state.minimizedPages = state.minimizedPages.filter((p) => p.route !== action.payload);
    },
  },
});

export const { minimizePage, restorePage, removeMinimizedPage } = uiSlice.actions;
export default uiSlice.reducer;