import React from 'react';
import { useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchProducts = async (searchQuery) => {
    if (searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/products/searchProductsBySlugPart?slugPart=${searchQuery}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setResults(data);
        setShowDropdown(true);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    searchProducts(value);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-90" ref={dropdownRef}>
      <div className="flex items-center border rounded-lg overflow-hidden bg-white">
        <div className="flex items-center px-4 border-r">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          className="w-full px-4 py-2 outline-none"
          placeholder="Search products..."
        />
        {query && (
          <button 
            onClick={clearSearch}
            className="px-2 hover:text-gray-700"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        )}
      </div>

      {showDropdown && (query.length >= 2) && (
        <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <ul className="py-2">
              {results.map((product, index) => (
                <li 
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
                  onClick={() => {
                    console.log('Selected product:', product);
                    setShowDropdown(false);
                  }}
                ><Link to={`/product/${product.slug}`}>
                  <img 
                    src={product.thumbnail || "/api/placeholder/40/40"} 
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-gray-500">${product.price}</div>
                  </div></Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;