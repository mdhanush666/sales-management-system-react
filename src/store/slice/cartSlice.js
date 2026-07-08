import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cartData: []
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const duplicateProduct = state.cartData.some(product => product._id === action.payload._id);
            if (duplicateProduct) return;
            state.cartData = [...state.cartData, action.payload];
            return;
        },
        removeFromCart: (state, action) => {
            state.cartData = state.cartData.filter(item => item._id !== action.payload)
        },
        clearCart: (state, action) => {
            state.cartData = [];
        },
    }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer; 