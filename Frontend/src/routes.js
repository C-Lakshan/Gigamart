import { createBrowserRouter } from "react-router-dom";
import Shop from "./Shop";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import ShopApplicationWrapper from "./pages/ShopApplicationWrapper";
import ProductDetails from "./pages/ProductDetailPage/ProductDetails";
import { loadProductBySlug } from "./routes/products";
import AuthenticationWrapper from "./pages/AuthenticationWrapper";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import OAuth2LoginCallback from "./pages/OAuth2LoginCallback";
import Cart from "./pages/Cart/Cart";
import Account from "./pages/Account/Account";
import Checkout from "./pages/Checkout/Checkout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import OrderConfirmed from "./pages/OrderConfirmed/OrderConfirmed";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <ShopApplicationWrapper/>,
      children:[
        {
            path:"/",
            element:<Shop />
        },
        {
            path:"/Laptop",
            element:<ProductListPage categoryType={'Laptop'} />
        },
        {
          path:"/Desktop",
          element:<ProductListPage categoryType={'Desktop'}/>,
        },
        {
          path:"",
          element:<ProductListPage categoryType={'Accessories'}/>,
        },
        {
          path:"/product/:slug",
          loader: loadProductBySlug,
          element:<ProductDetails />,
        },
        {
         path:'/cart-items',
         element: <Cart />
        },
        {
          path:'/account-details',
          element: <ProtectedRoute><Account /></ProtectedRoute>
         },
         {
          path:'/checkout',
          element:<ProtectedRoute><Checkout /></ProtectedRoute>
         },
         {
          path:'/orderConfirmed',
          element: <OrderConfirmed />
         }
      ]
    },
    {
      path:"/v1/",
      element:<AuthenticationWrapper/>,
      children:[
        {
          path:"login",
          element:<Login />
        },
        {
          path:"register",
          element:<Register />
        }
      ]
    },
    {
      path:'/oauth2/callback',
      element:<OAuth2LoginCallback/>
    }
  ]); 