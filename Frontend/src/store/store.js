import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productReducer from './features/product'
import cartReducer from './features/cart';
import categoryReducer from './features/category';
import commonReducer from './features/common';
import userReducer from './features/user';
import wishlistReducer from './features/wishlist';  // Import wishlist reducer

const rootReducer = combineReducers({
    productState: productReducer,
    cartState: cartReducer,
    categoryState: categoryReducer,
    commonState:commonReducer,
    userState:userReducer,
    wishlist: wishlistReducer, // Add wishlist reducer here
})

const store = configureStore({
    reducer : rootReducer
})

export default store;