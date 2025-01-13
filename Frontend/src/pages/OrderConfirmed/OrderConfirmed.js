// import React, { useMemo } from 'react'
// import { useLocation } from 'react-router-dom';

// const OrderConfirmed = () => {

//   const location = useLocation();

//   const orderId = useMemo(()=>{
//     const query = new URLSearchParams(location.search);
//     const orderId = query.get('orderId');
//     return orderId;
//   },[location.search]);

//   return (
//     <div className='p-8'>
//         <h1 className='text-2xl'>Thank you for shopping with us!</h1>
//         <p>Your order has been successfully placed. Your order ID is <strong>{orderId}</strong>.</p>
//     </div>
//   )
// }

// export default OrderConfirmed

import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";

const OrderConfirmed = () => {
  const location = useLocation();

  const orderId = useMemo(() => {
    const query = new URLSearchParams(location.search);
    return query.get("orderId");
  }, [location.search]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full relative -mt-20">
        <div className="flex justify-center mb-4">
          <svg
            className="w-16 h-16 text-green-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m7 4a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Thank you for shopping with us!
        </h1>
        <p className="text-gray-600 mb-2">
          Your order has been successfully placed.
        </p>
        <p className="font-semibold text-gray-600 mb-4">
          Please check your Mail.
        </p>
        <p className="text-gray-800">
          Your order ID is <strong className="text-green-600">{orderId}</strong>
          .
        </p>
        <button
          className="mt-6 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
          onClick={() => {
            window.location.href = "/";
          }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmed;
