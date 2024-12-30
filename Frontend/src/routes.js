import { createBrowserRouter } from "react-router-dom";
import Shop from "./Shop";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import ShopApplicationWrapper from "./pages/ShopApplicationWrapper";
import ProductDetails from "./pages/ProductDetailPage/ProductDetails";
import { loadProductBySlug } from "./routes/products";

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
          path:"",
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
        }
      ]
    }
  ]); 