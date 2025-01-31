import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectWishListItems } from '../../store/features/wishlist';
import { removeItemFromWishListAction } from '../../store/actions/wishlistAction';
import { addItemToCartAction } from '../../store/actions/cartAction';
import { Link } from 'react-router-dom';
import DeleteIcon from '../../components/common/DeleteIcon';
import EmptyWishlist from '../../assets/img/empty_wishlist.png';

const WishList = () => {
  const wishListItems = useSelector(selectWishListItems);
  const dispatch = useDispatch();

  const onAddToCart = (item) => {
    dispatch(addItemToCartAction({
      productId: item.productId,
      name: item.name,
      price: item.price,
      thumbnail: item.thumbnail,
      quantity: 1,
      variant: item.variant || {},
      subTotal: item.price * 1, // Ensure subtotal calculation

    }));
    // Remove from Wishlist after adding to Cart
    dispatch(removeItemFromWishListAction(item.productId));
  };

  return (
    <div className='p-4'>
      {wishListItems?.length > 0 ? (
        <>
          <p className='text-xl text-black p-4'>Your Wishlist</p>
          <table className='w-full text-lg'>
            <thead className='text-sm bg-black text-white uppercase'>
              <tr>
                <th className='px-6 py-3'>Product Details</th>
                <th className='px-6 py-3'>Price</th>
                <th className='px-6 py-3'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {wishListItems.map((item, index) => (
                <tr key={index} className='p-4 bg-white border-b'>
                  <td>
                    <div className='flex p-4'>
                      <img src={item.thumbnail} alt={'product-' + index} className='w-[120px] h-[120px] object-cover'/>
                      <div className='flex flex-col text-sm px-2 text-gray-600'>
                        <p>{item.name || 'Name'}</p>
                      </div>
                    </div>
                  </td>
                  <td className='text-center text-sm text-gray-600'>${item.price}</td>
                  <td className='flex flex-col justify-center items-center gap-2 h-full'>
                    {/* Add the button to navigate to product details */}
                    <Link 
                      to={`/product/${item.slug}`}
                      className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition'
                    >
                      View Details
                    </Link>
                    <button 
                      className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition' 
                      onClick={() => onAddToCart(item)}
                    >
                      Add to Cart
                    </button>
                    <button 
                      className='flex justify-center items-center bg-red-500 text-white p-2 rounded hover:bg-red-700 transition' 
                      onClick={() => dispatch(removeItemFromWishListAction(item.productId))}
                    >
                      <DeleteIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className='w-full items-center text-center'>
          <div className='flex justify-center'>
            <img src={EmptyWishlist} className='w-[240px] h-[240px]' alt='empty-wishlist'/>
          </div>
          <p className='text-3xl font-bold'>Your wishlist is empty</p>
          <div className='p-4'>
            <Link to={'/'} className='w-full p-2 items-center h-[48px] bg-black border rounded-lg mt-2 text-white hover:bg-gray-800'>
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishList;
