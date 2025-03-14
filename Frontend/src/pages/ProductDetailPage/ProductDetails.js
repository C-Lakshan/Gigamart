import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLoaderData, useParams } from 'react-router-dom'
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Category from '../../components/Sections/Categories/Category';
import content from '../../data/content.json'
import Rating from '../../components/Rating/Rating';
import ProductColors from './ProductColors';
import {CartIcon} from '../../components/common/CartIcon'
import SvgCreditCard from '../../components/common/SvgCreditCard'
import SvgShipping from '../../components/common/SvgShipping';
import SvgReturn from '../../components/common/SvgReturn';
import SectionHeading from '../../components/Sections/SectionsHeading/SectionHeading';
import ProductCard from '../ProductListPage/ProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/features/cart';
import _ from 'lodash';
import { getAllProducts } from '../../api/fetchProducts';
import { addItemToCartAction } from '../../store/actions/cartAction';
import { addItemToWishListAction } from '../../store/actions/wishlistAction';
import Footer from '../../components/Footer/Footer'


//const categories = content?.categories

const extraSections = [
  {
    icon:<SvgCreditCard />,
    label:'Secure payment'
  },
  {
    icon:<SvgShipping />,
    label:'Free shipping'
  },
  {
    icon:<SvgReturn />,
    label:'Free Shipping & Returns'
  }
]

const ProductDetails = () => {  
  const { product } = useLoaderData();
  const [image, setImage] = useState();
  const [breadCrumbLinks, setBreadCrumbLink] = useState([]);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartState?.cart);
  const [similarProduct,setSimilarProducts] = useState([]);
  const categories = useSelector((state)=> state?.categoryState?.categories);
  const [error,setError] = useState('');

  const productCategory = useMemo(() => {
    return categories?.find((category) => category?.id === product?.categoryId);
  }, [product, categories]);


  const similarProducts = useMemo(()=>{
    return content?.products?.filter((item)=> (item?.type_id === product?.type_id && item?.id !== product?.id));
  },[product]);

  
  useEffect(() => {
    setImage(product?.thumbnail);
    setBreadCrumbLink([]);
    const arrayLinks = [{ title: 'Shop', path: '/' }, {
      title: productCategory?.name,
      path: productCategory?.name
    }];
    const productType = productCategory?.categoryTypes?.find((item)=> item?.id === product?.categoryTypeId);
    
    if(productType){
      arrayLinks?.push({
        title: productType?.name,
        path: productType?.name
      })
    }
    setBreadCrumbLink(arrayLinks);
  }, [productCategory, product]);

  

  const addItemToCart = useCallback(()=>{
    
    //dispatch(addToCart({id:product?.id,quantity:1}));
    const selectedVariant = product?.variants?.[0];
      
    dispatch(addItemToCartAction({
      productId: product?.id,
      thumbnail: product?.thumbnail,
      name: product?.name,
      variant: selectedVariant,
      quantity: 1,
      subTotal: product?.price,
      price: product?.price,
    }))

  },[dispatch, product?.id]);

  // Add item to wishlist
  const onAddToWishlist = () => {
    const item = { productId: product?.id, title: product?.name, price: product?.price, brand: product?.brand, thumbnail: product?.thumbnail };
    dispatch(addItemToWishListAction(item)); // Dispatch action to add item to wishlist
  };
  
    
  return (  
    <>
    <div className='flex flex-col md:flex-row px-10'>
      <div className='w-[100%] lg:w-[50%] md:w-[40%]'> 
        {/* Image */}
        <div className='flex flex-col md:flex-row'>
          <div className='w-[100%] md:w-[20%] justify-center h-[40px] md:h-[420px]'>
              {/* Stack images */}
              <div className='flex flex-row md:flex-col justify-center h-full'>
              {
                product?.productResources?.map((item, index) => (
                  <button key={index} onClick={() => setImage(item?.url)} className='rounded-lg w-fit p-2 mb-2'><img src={item?.url} className='h-[60px] w-[60px] rounded-lg bg-cover bg-center hover:scale-105 hover:border' alt={'sample-' + index} /></button>
                ))
              }
              </div>

          </div>
          <div className='w-full md:w-[80%] flex justify-center md:pt-0 pt-10'>
            <img src={image} className='h-full w-full max-h-[520px]
           border rounded-lg cursor-pointer object-cover' alt={product?.name}/>
          </div>
        </div>

      </div>
      <div className='w-[60%] px-10'>USD
      {/* Product Description */}
      <Breadcrumb links={breadCrumbLinks} />
      <p className='text-3xl pt-4'>{product?.name}</p>
      <Rating rating={product?.rating}/>
      {/* Price Tag */}
      <p className='text-xl bold py-2'>$ {product?.price}</p>

    
      {/* Stock Status Display */}
      <div>
        {product?.variants?.[0]?.stockQuantity > 0 ? (
              <p className='text-lg bold text-blue-500'>In Stock</p>
            ) : (
              <p className='text-lg bold text-red-500'>Out Stock</p>
            )}
      </div>

      <div className='flex py-4 gap-4'>
          <button 
            onClick={addItemToCart} 
            disabled={!(product?.variants?.[0]?.stockQuantity > 0)}
            className={`bg-black rounded-lg hover:bg-gray-700 ${!(product?.variants?.[0]?.stockQuantity > 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className='flex h-[42px] rounded-lg w-[150px] px-2 items-center justify-center bg-black text-white hover:bg-gray-700'>
              <svg width="17" height="16" className='' viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1.5 1.33325H2.00526C2.85578 1.33325 3.56986 1.97367 3.6621 2.81917L4.3379 9.014C4.43014 9.8595 5.14422 10.4999 5.99474 10.4999H13.205C13.9669 10.4999 14.6317 9.98332 14.82 9.2451L15.9699 4.73584C16.2387 3.68204 15.4425 2.65733 14.355 2.65733H4.5M4.52063 13.5207H5.14563M4.52063 14.1457H5.14563M13.6873 13.5207H14.3123M13.6873 14.1457H14.3123M5.66667 13.8333C5.66667 14.2935 5.29357 14.6666 4.83333 14.6666C4.3731 14.6666 4 14.2935 4 13.8333C4 13.373 4.3731 12.9999 4.83333 12.9999C5.29357 12.9999 5.66667 13.373 5.66667 13.8333ZM14.8333 13.8333C14.8333 14.2935 14.4602 14.6666 14 14.6666C13.5398 14.6666 13.1667 14.2935 13.1667 13.8333C13.1667 13.373 13.5398 12.9999 14 12.9999C14.4602 12.9999 14.8333 13.373 14.8333 13.8333Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Add to cart
            </div>
          </button>

          <button onClick={onAddToWishlist} className='bg-black rounded-lg hover:bg-gray-700'>
              <div className='flex h-[42px] rounded-lg w-[150px] px-2 items-center justify-center bg-black text-white hover:bg-gray-700'>
                Add to Wishlist
              </div>
            </button>
      </div>
      
      <div className='grid grid-cols-2 gap-4 pt-4'>
        {
            extraSections?.map((section,index)=>(
              <div key={index} className='flex items-center'>
                {section?.icon}
                <p className='px-2'>{section?.label}</p>
              </div>
            ))
          } 

      </div>
      </div>

      
    </div>
    {/* Product Description */}
    <SectionHeading title={'Product Description'} />
    <div className='md:w-[50%] w-full p-2'>
  
    {product?.description
    ?.replace(/\\n/g, '\n') // Replace literal "\n" with actual newline
    .split('\n') // Split into lines
    .map((line, index) => (
      <p className='p-2 px-10' key={index}>{line}</p>
    ))}
    </div>

    <SectionHeading title={'Similar Products'} />
    <div className='flex px-10'>
    
    <div className='pt-4 grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-8 px-2 pb-10'>
                {similarProduct?.map((item,index)=>(
                  <ProductCard key={index} {...item}/>
                ))}
                {!similarProduct?.length && <p>No Products Found!</p>}
                </div>
    </div>
    <Footer content={content?.footer}/>
    </>
  )
}

export default ProductDetails
