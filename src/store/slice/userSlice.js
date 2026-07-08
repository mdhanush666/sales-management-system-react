import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // Switching to sessionStorage so it wipes when the browser tab closes
    loggedUserID: sessionStorage.getItem("loggedUserID") || null,
    userRole: sessionStorage.getItem("userRole") || null, 
    selectedCustomerID: sessionStorage.getItem("selectedCustomerID") || null
};

export const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        setLoggedUserID: (state, action) => {
            const { userID, role } = action.payload; // Pass both on login success
            state.loggedUserID = userID;
            state.userRole = role;
            
            sessionStorage.setItem("loggedUserID", userID);
            sessionStorage.setItem("userRole", role);
        },
        setSelectedCustomerID: (state, action) => {
            state.selectedCustomerID = action.payload;
            sessionStorage.setItem("selectedCustomerID", action.payload);
        },
        clearAuthSession: (state) => {
            state.loggedUserID = null;
            state.userRole = null;
            state.selectedCustomerID = null;
            
            sessionStorage.clear(); // Safely clear all session tokens
        },
        clearSelectedCustomerID: (state) => {
            state.selectedCustomerID = null;
            sessionStorage.removeItem("selectedCustomerID");
        }
    }
});

export const { setLoggedUserID, setSelectedCustomerID, clearAuthSession, clearSelectedCustomerID } = userSlice.actions;
export default userSlice.reducer;