import React from 'react';
import { useDispatch } from 'react-redux';
import { addItemToWishListAction } from '../../store/actions/wishlistAction';
import SvgFavourite from '../../components/common/SvgFavourite';
import { Link } from 'react-router-dom';

const ProductCard = ({ id, title, description, price, discount, rating, brand, thumbnail, slug }) => {
  const dispatch = useDispatch();

  const onAddToWishlist = () => {
    const item = { productId: id, title, price, brand, thumbnail };
    dispatch(addItemToWishListAction(item));
  };

  return (
    <div className='flex flex-col hover:scale-105 relative border rounded-lg p-2 min-h-[390px]'>
      <Link to={`/product/${slug}`} className='w-full'>
        <div className='h-[280px] w-full'>
        <img className='h-full w-full object-cover rounded-lg' src={thumbnail} alt='Image' />

        </div>
      </Link>
      <div className='flex flex-col justify-between flex-grow pt-2'>
        <div className='w-full'>
          <p className='text-[16px] p-1 truncate'>{title}</p>
          {description && <p className='text-[12px] px-1 text-gray-600 truncate'>{brand}</p>}
        </div>
        <div className='pt-0'>
          <p className='text-lg font-semibold'>${price}</p>
        </div>
      </div>
      <button onClick={onAddToWishlist} className='absolute top-2 right-2 p-2 cursor-pointer'>
        <SvgFavourite />
      </button>
    </div>
  );
};

export default ProductCard;
