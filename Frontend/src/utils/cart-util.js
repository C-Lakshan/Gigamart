import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    cart:JSON.parse(localStorage.getItem('cart')) || []
    
    }
    
    I
    
    const cartSlice = createSlice({
    
        name: 'cartState',
        initialState: initialState,
        reducers: {
            addToCart: (state, action) =>{
            state.cart.push(action?.payload)
            return state;
            },
            removeFromCart: (state,action)=>{return state?.cart?.filter((item) => item.id = action?.payload);
            }
        }
    })
    
    export const {addToCart, removeFromCart} = cartSlice?.actions;
    
    export const countCartItems = (state) => state?.cartState?.cart?.length
    export const selectCartItems = (state) => state?.cartState?.cart?? []
    export default cartSlice.reducer;