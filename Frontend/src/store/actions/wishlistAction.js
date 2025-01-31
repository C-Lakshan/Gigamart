import axios from 'axios';
import { addToWishlist, removeFromWishlist } from '../features/wishlist';

// Action to add an item to the wishlist
export const addItemToWishListAction = (item) => async (dispatch) => {
    try {
        console.log('Fetching details for productId:', item.productId);

        // Fetch product details from the backend API
        const response = await axios.get(`http://localhost:8080/api/products/${item.productId}`);
        const product = response.data;

        // Get the first available variant or default empty object
        const variant = product.variants?.[0] || {};

        dispatch(addToWishlist({
            productId: product.id,
            name: product.name,
            price: variant.price || product.price, // Ensure price is properly assigned
            thumbnail: product.thumbnail,
            size: variant.size || null,
            color: variant.color || null,
            quantity: 1, 
            subTotal: (variant.price || product.price) * 1, // Correct subtotal calculation
            variant: variant,
            slug:product.slug,
        }));
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error('Product not found. Please check the product ID.');
        } else {
            console.error('Failed to fetch product details:', error);
        }
    }
};

// Action to remove an item from the wishlist
export const removeItemFromWishListAction = (productId) => async (dispatch) => {
    dispatch(removeFromWishlist(productId));
};
