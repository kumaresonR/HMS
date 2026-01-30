import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    user: {},              // Holds user data
    error: "",             // For error messages
    loading: false,        // Indicates if a process is ongoing
    isUserLogout: false,   // Indicates if a user is logged out
    errorMsg: false,       // Used to trigger error alerts
};

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        // Handles API Error
        apiError(state, action) {
            state.error = action.payload.message || "Something went wrong!";
            state.loading = false;
            state.isUserLogout = false;
            state.errorMsg = true;
        },
        // Handles Login Success
        loginSuccess(state, action) {
            state.user = action.payload;
            state.loading = false;
            state.error = "";
            state.errorMsg = false;
        },
        // Handles Logout Success
        logoutUserSuccess(state) {
            state.user = {};
            state.isUserLogout = true;
            state.error = "";
            state.errorMsg = false;
        },
        // Resets Login Error Flag
        reset_login_flag(state) {
            state.error = "";
            state.errorMsg = false;
        },
    },
});

export const { apiError, loginSuccess, logoutUserSuccess, reset_login_flag } = loginSlice.actions;

export default loginSlice.reducer;
