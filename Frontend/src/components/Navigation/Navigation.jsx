import React from 'react';
import Wishlist from '../common/Wishlist';
import AccountIcon from '../common/AccountIcon';
import { CartIcon } from '../common/CartIcon';
import SearchBar from '../SearchBar/SearchBar';
import './Navigation.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { countCartItems } from '../../store/features/cart';
import { countWishlistItems } from '../../store/features/wishlist';

const Navigation = ({ variant = "default" }) => {
  const cartLength = useSelector(countCartItems);
  const wishlistLength = useSelector(countWishlistItems); 

  const navigate = useNavigate();

  return (
    <nav className='flex items-center py-6 px-16 justify-between gap-18 custom-nav'>
      <div className='flex items-center gap-5'>
        {/* Logo */}
        <a className='text-3xl text-black gap-8' href='/'>GigaMart</a>
      </div>

      {variant === "default" &&
        <div className='flex flex-wrap items-center gap-10'>
          {/* Nav items */}
          <ul className='flex gap-8 text-gray-600 hover:text-black'>
            <li><NavLink to='/' className={({ isActive }) => isActive ? 'active-link' : ''}>Shop</NavLink></li>
            <li><NavLink to='/Laptop' className={({ isActive }) => isActive ? 'active-link' : ''}>Laptop</NavLink></li>
            <li><NavLink to='/Desktop' className={({ isActive }) => isActive ? 'active-link' : ''}>Desktop</NavLink></li>
            <li><NavLink to='/Accessories' className={({ isActive }) => isActive ? 'active-link' : ''}>Accessories</NavLink></li>
            <li><NavLink to="/Services" className={({ isActive }) => (isActive ? "active-link" : "")}>Services</NavLink></li>

          </ul>
        </div>
      }

      {/* Search */}
      {variant === "default" &&
        <div className='flex justify-center'>
          <SearchBar />
        </div>
      }

      <div className='flex flex-wrap items-center gap-5'>
        {/* Action Items - icons */}
        {variant === "default" &&
          <ul className='flex items-center gap-8'>
            {/* Wishlist Icon with Count */}
            <li className='relative'>
              <button>
                <Link to='/wishlist'>
                  <Wishlist />
                  {wishlistLength > 0 && (
                    <div className='absolute top-[-2px] right-[-2px] inline-flex items-center justify-center h-6 w-6 bg-black text-white rounded-full border-2 text-xs border-white'>
                      {wishlistLength}
                    </div>
                  )}
                </Link>
              </button>
            </li>

            {/* Account Icon */}
            <li><button onClick={() => navigate('/account-details/profile')}><AccountIcon /></button></li>

            {/* Cart Icon with Count */}
            <li>
              <Link to='/cart-items' className='flex flex-wrap'>
                <CartIcon />
                {cartLength > 0 && (
                  <div className='absolute ml-6 inline-flex items-center justify-center h-6 w-6 bg-black text-white rounded-full border-2 text-xs border-white'>
                    {cartLength}
                  </div>
                )}
              </Link>
            </li>
          </ul>
        }

        {variant === "auth" &&
          <ul className='flex gap-8'>
            <li className='text-black border border-black hover:bg-slate-100 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none'>
              <NavLink to="/v1/login" className={({ isActive }) => isActive ? 'active-link' : ''}>Login</NavLink>
            </li>
            <li className='text-black border border-black hover:bg-slate-100 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none'>
              <NavLink to="/v1/register" className={({ isActive }) => isActive ? 'active-link' : ''}>Signup</NavLink>
            </li>
          </ul>
        }
      </div>
    </nav>
  )
}

export default Navigation;
