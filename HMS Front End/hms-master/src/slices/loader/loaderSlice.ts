import { createSlice } from "@reduxjs/toolkit";

const loaderSlice = createSlice({
    name: "loader",
    initialState: { loading: false, requestCount: 0 },
    reducers: {
        showLoader: (state) => {
            state.requestCount += 1;
            state.loading = true;
        },
        hideLoader: (state) => {
            state.requestCount -= 1;
            if (state.requestCount === 0) {
                state.loading = false;
            }
        },
    },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export default loaderSlice.reducer;