import { createBrowserRouter } from "react-router-dom";
import Shop from "./Shop";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import ShopApplicationWrapper from "./pages/ShopApplicationWrapper";
import ProductDetails from "./pages/ProductDetailPage/ProductDetails";
import { loadProductById } from "./routes/products";

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
          path:"/Accessories",
          element:<ProductListPage categoryType={'Accessories'}/>,
        },
        {
          path:"/product/:productId",
          loader: loadProductById,
          element:<ProductDetails />,
        }
      ]
    }
  ]); 