import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Wishlist from '../common/Wishlist';
import AccountIcon from '../common/AccountIcon';
import { CartIcon } from '../common/CartIcon';
import { Link, NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { countCartItems } from '../../store/features/cart';
import { countWishlistItems } from '../../store/features/wishlist';
import './Navigation.css';

const Navigation = ({ variant = "default" }) => {
  // Get cart and wishlist item counts from Redux store
  const cartLength = useSelector(countCartItems);
  const wishlistLength = useSelector(countWishlistItems);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:3000/api/products?query=${searchQuery}`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setSuggestions(data);
        } else {
          console.error('Invalid API response:', data);
          setSuggestions([]);
        }
      })
      .catch(error => {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      });
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter' && searchQuery.trim() !== '') {
      navigate(`/product/${encodeURIComponent(searchQuery)}`);
      setSuggestions([]);
    }
  };

  return (
    <nav className='flex items-center py-6 px-16 justify-between gap-20 custom-nav'>
      <div className='flex items-center gap-6'>
        {/* Logo */}
        <a className='text-3xl text-black gap-8' href='/'>GigaMart</a>
      </div>

      {/* Navigation Links */}
      {variant === "default" && (
        <div className='flex flex-wrap items-center gap-10'>
          {/* Nav items */}
          <ul className='flex gap-12 text-gray-600 hover:text-black'>
            <li><NavLink to='/' className={({ isActive }) => isActive ? 'active-link' : ''}>Shop</NavLink></li>
            <li><NavLink to='/Laptop' className={({ isActive }) => isActive ? 'active-link' : ''}>Laptop</NavLink></li>
            <li><NavLink to='/Desktop' className={({ isActive }) => isActive ? 'active-link' : ''}>Desktop</NavLink></li>
            <li><NavLink to='/Accessories' className={({ isActive }) => isActive ? 'active-link' : ''}>Accessories</NavLink></li>
          </ul>
        </div>
      )}

      {/* Search Bar with Suggestions */}
      {variant === "default" && (
        <div className='flex justify-center relative'>
          <div className='border rounded flex overflow-hidden'>
            <div className="flex items-center justify-center px-4 border-r">
              <svg className="h-4 w-4 text-grey-dark" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
              </svg>
            </div>
            <input
              type="text"
              className="px-4 py-2 outline-none"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleSearch}
            />
          </div>
          {suggestions.length > 0 && (
            <ul className="absolute bg-white border mt-1 w-full rounded shadow-lg">
              {suggestions.map((item, index) => (
                <li 
                  key={item.id || index} 
                  className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => navigate(`/product/${item.slug || encodeURIComponent(item.name)}`)}
                >
                  {item.name || "Unknown Product"}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Icons: Wishlist, Account, Cart */}
      <div className='flex flex-wrap items-center gap-4'>
        {/* Action Items - icons */}
        {variant === "default" && (
          <ul className='flex items-center gap-8'>
            {/* Wishlist Icon with Count */}
            <li className='relative'>
              <Link to='/wishlist'>
                <Wishlist />
                {wishlistLength > 0 && (
                  <div className='absolute top-[-2px] right-[-2px] inline-flex items-center justify-center h-6 w-6 bg-black text-white rounded-full border-2 text-xs border-white'>
                    {wishlistLength}
                  </div>
                )}
              </Link>
            </li>
            <li>
              <button onClick={() => navigate('/account-details/profile')}>
                <AccountIcon />
              </button>
            </li>
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
        )}
      </div>
    </nav>
  );
};

export default Navigation;
