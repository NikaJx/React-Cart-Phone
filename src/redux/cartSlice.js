import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const url ='https://course-api.com/react-useReducer-cart-project';

const initialState = {
    cartItems: [],
    amount: 4,
    total: 0,
    isLoading: true
}

export const getCartItems = createAsyncThunk('cart/getCartItems', async (_, thunkAPI) => {
    try {
        const res = await fetch(url);
        
        return res.json();

    } catch (error) {
        return thunkAPI.rejectWithValue('Something went wrong');
    }
});

const cartSlice = createSlice({
    name: 'cart',
    initialState,

    reducers: {
        clearCart: (state) => {
            state.cartItems = [];
        },
        removeItem: (state, action) => {
            const itemId = action.payload;
            state.cartItems = state.cartItems.filter((item => item.id !== itemId));
        },
        incremnet: (state, { payload }) => {
            const cartItem = state.cartItems.find(item => item.id == payload.id);
            cartItem.amount = cartItem.amount + 1
        },
        decrement: (state, { payload }) => {
            const cartItem = state.cartItems.find(item => item.id == payload.id);
            cartItem.amount = cartItem.amount - 1
        },
        calculateTotals: (state) => {
            let amount = 0;
            let total = 0;
            
            state.cartItems.forEach(item => {
                amount += item.amount;
                total += item.amount * item.price;
            });
            state.amount = amount;
            state.total = total;
        }
    },
    extraReducers: {
        [getCartItems.pending]: (state) => {
            state.isLoading = true;
        },
        [getCartItems.fulfilled]: (state, action) => {
            state.isLoading = false;
            state.cartItems = action.payload;
        },
        [getCartItems.rejected]: (state, action) => {
            state.isLoading = false;
        }
    }
});

export const { clearCart, removeItem, incremnet, decrement,calculateTotals } = cartSlice.actions;

export default cartSlice.reducer;