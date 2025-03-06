// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { API_BASE_URL, API_URLS, getHeaders } from "../../api/constant";

// const HOME_URL = "http://localhost:3000/";
// // const BASE_URL = "http://localhost:8080/";
// // const BASE_URL = "http://localhost:8000/";

// const AdminPanel = () => {
//   const [activeTab, setActiveTab] = useState("dashboard");
//   const [products, setProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [orders, setOrders] = useState([]);
//   const [transactions, setTransactions] = useState([]);
//   const [users, setUsers] = useState([]);
  
//   const [dashboardData, setDashboardData] = useState({
//     users: 0,
//     sales: 0,
//     totalCustomers: 0,
//     totalOrders: 0,
//     totalTransactions: 0,
//     monthlySales: [],
//   });

//   const [marketingData, setMarketingData] = useState({
//     campaigns: 3,
//     leads: 250,
//   });
//   const [reportsData, setReportsData] = useState({ salesReport: "Q1 Report" });
//   const [showModal, setShowModal] = useState(false);
//   const [searchSlug, setSearchSlug] = useState("");

//   const [newProduct, setNewProduct] = useState({
//     // name: "",
//     // price: "",
//     // category: "",
//     // stock: "",
//   });

//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editProduct, setEditProduct] = useState(null);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [itemToDelete, setItemToDelete] = useState(null);
//   const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

//   const initialProductState = {
//     name: "",
//     brand: "",
//     deviceType: "",
//     price: "",
//     thumbnail: "",
//     slug: "",
//     description: "",
//     variants: [{ color: "", size: "", stockQuantity: 0 }],
//     productResources: [{ name: "", url: "", type: "" }],
//     newArrival: false,
//   };


//   const fetchProducts = async () => {
//     const url = API_BASE_URL + "/api/products";
//     try {
//       const result = await axios(url, {
//         method: "GET",
//       });

//       const filteredData = result?.data.map((product) => ({
//         id: product.id,
//         slug: product.slug,
//         brand: product.brand,
//         price: product.price,
//         rating: product.rating,
//         description: product.description,
//       }));

//       setProducts(filteredData);
//       return filteredData;
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const fetchCategories = async () => {
//     const url = API_BASE_URL + "/api/category";
//     try {
//       const result = await axios(url, {
//         method: "GET",
//       });

//       const filteredData = result?.data.map((category) => ({
//         // name: category.name,
//       }));

//       setCategories(filteredData);
//       console.log(filteredData);
//       return filteredData;
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // const fetchCategories = async () => {
//   //   const data = [
//   //     { id: 1, name: "Electronics", description: "Electronic goods" },
//   //     { id: 2, name: "Clothing", description: "Fashion items" },
//   //   ];
//   //   setCategories(data);
//   // };


//   // Fetch data when tab changes
//   useEffect(() => {
//     if (activeTab === "products") fetchProducts();
//     if (activeTab === "categories") fetchCategories();
//     if (activeTab === "orders") fetchOrders();
//     if (activeTab === "transactions") fetchTransactions();
//     if (activeTab === "users") fetchUsers();
//     if (activeTab === "dashboard") fetchDashboardStats();
//   }, [activeTab]);


//   // const handleUpdate = (id, type) => {
//   //   alert(`Update clicked for ID ${id} in ${type}`);
//   // };

//   const handleAddProduct = (e) => {
    
//     e.preventDefault();

//     const product = {
//       name: newProduct.name,
//       description: newProduct.description,
//       price: newProduct.price,
//       brand: newProduct.brand,
//       newArrival: true,
//       rating: 4,
//       categoryId: "edb0c4b4-6e85-404e-a8d0-72857b1c4395",
//       thumbnail: "https://example.com/images/mac_pro_8core.jpg",
//       slug: newProduct.slug,
//       categoryName: newProduct.deviceType,
//       categoryTypeId: "49cc3d90-606d-4851-8cd7-934a1434f756",
//       categoryTypeName: newProduct.brand,
//       variants: [
//         {
//           color: newProduct.variantsColor,
//           size: newProduct.variantsSize,
//           stockQuantity: newProduct.variantsStockQuantity,
//         },
//       ],
//       productResources: [
//         {
//           name: newProduct.productResourceName,
//           url: newProduct.productResourceUrl,
//           type: newProduct.productResourceType,
//           isPrimary: true,
//         },
//       ],
//     };

//     // Retrieve the JWT token from localStorage
//     const authToken = localStorage.getItem("authToken");
//     console.log(authToken);
//     // POST request to the API
//     fetch(`${API_BASE_URL}api/products`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         // Include the Authorization header with the Bearer token
//         Authorization: `Bearer ${authToken}`,
//       },
//       body: JSON.stringify(product),
//     })
//       .then((response) => {
//         if (response.ok) {
//           // Parse the response as JSON
//           return response.json();
//         }
//         throw new Error("Failed to add product");
//       })
//       .then((data) => {
//         console.log("Product added:", data);
//         setProducts([...products, data]);
//         setNewProduct({
//           name: "",
//           description: "",
//           price: "",
//           brand: "",
//           newArrival: false,
//           rating: "",
//           categoryId: "",
//           thumbnail: "",
//           slug: "",
//           categoryName: "",
//           categoryTypeId: "",
//           categoryTypeName: "",
//           variants: [
//             {
//               color: "",
//               size: "",
//               stockQuantity: "",
//             },
//           ],
//           productResources: [
//             {
//               name: "",
//               url: "",
//               type: "",
//               isPrimary: "",
//             },
//           ],
//         });
//         alert("Product added successfully");
//         setNewProduct(initialProductState);
//         // setShowModal(false); // Close the modal after submission
//       })
//       .catch((error) => {
//         console.error("Error adding product:", error);
//         alert("Error adding product");
//       });
//   };

//   const handleUpdateProduct = (e) => {
//     e.preventDefault();
//     // Update the products state with the edited product
//     setProducts(
//       products.map((product) =>
//         product.id === editProduct.id ? { ...editProduct } : product
//       )
//     );
//     setShowEditModal(false);
//     alert("Product updated successfully");
//     setNewProduct(initialProductState);
//     setShowModal(false);
//   };


//   const renderModal = () => {
//     return (
//       <div
//         className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 ${
//           !showModal && "hidden"
//         }`}
//         onClick={() => setShowModal(false)}
//       >
//         <div
//           className="bg-gray-900 text-white p-6 rounded-lg w-2/3 md:w-1/2"
//           onClick={(e) => e.stopPropagation()}
//         >
//           <h2 className="text-xl font-semibold mb-4">
//             {editProduct ? "Edit Product" : "Add Product"}
//           </h2>
//           <form
//             onSubmit={editProduct ? handleUpdateProduct : handleAddProduct}
//             className="grid grid-cols-1 md:grid-cols-2 gap-4"
//           >
//             {/* Left Column */}
//             <div>
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Product Name"
//                 value={editProduct ? editProduct.name : newProduct.name}
//                 onChange={(e) =>
//                   setNewProduct({
//                     ...newProduct,
//                     name: e.target.value,
//                   })
//                 }
//                 className="w-full p-2 mb-4 border border-gray-700 rounded bg-gray-900 text-white text-sm"
//                 required
//               />

//               {/* Brand Dropdown */}
//               {/* <label className="block text-white text-sm mb-2">Brand</label> */}
//               <select
//                 name="brand"
//                 value={editProduct ? editProduct.brand : newProduct.brand}
//                 onChange={(e) =>
//                   setNewProduct({
//                     ...newProduct,
//                     brand: e.target.value,
//                   })
//                 }
//                 className="w-full p-2 mb-4 border border-gray-700 rounded bg-gray-900 text-white text-sm"
//                 required
//               >
//                 <option value="" disabled selected>
//                   Select a Brand
//                 </option>
//                 <option value="Apple">Apple</option>
//                 <option value="Asus">Asus</option>
//                 <option value="Acer">Acer</option>
//                 <option value="Dell">Dell</option>
//                 <option value="HP">HP</option>
//                 <option value="Lenovo">Lenovo</option>
//                 <option value="Microsoft">Microsoft</option>
//                 <option value="MSI">MSI</option>
//                 <option value="Samsung">Samsung</option>
//               </select>

//               {/* Device Type Dropdown */}
//               {/* <label className="block text-white text-sm mb-2">
//                 Device Type
//               </label> */}
//               <select
//                 name="deviceType"
//                 value={
//                   editProduct ? editProduct.deviceType : newProduct.deviceType
//                 }
//                 onChange={(e) =>
//                   setNewProduct({
//                     ...newProduct,
//                     deviceType: e.target.value,
//                   })
//                 }
//                 className="w-full p-2 mb-4 border border-gray-700 rounded bg-gray-900 text-white text-sm"
//                 required
//               >
//                 <option value="" disabled selected>
//                   Select a Device Type
//                 </option>
//                 <option value="Desktop">Desktop</option>
//                 <option value="Laptop">Laptop</option>
//               </select>

//               <input
//                 type="number"
//                 name="price"
//                 placeholder="Price"
//                 value={editProduct ? editProduct.price : newProduct.price}
//                 onChange={(e) =>
//                   setNewProduct({
//                     ...newProduct,
//                     price: e.target.value,
//                   })
//                 }
//                 className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
//                 required
//               />
              

              
//             </div>

//             <button
//               type="submit"
//               className="w-full py-3 text-white bg-gray-800 rounded hover:bg-gray-700 mt-4"
//             >
//               {editProduct ? "Update Product" : "Add Product"}
//             </button>
//           </form>
//           <button
//             className="absolute top-2 right-2 text-white"
//             onClick={() => setShowModal(false)}
//           >
//             &times;
//           </button>
//         </div>
//       </div>
//     );
//   };


//   return (
//     <div className="flex p-8 bg-gray-900 min-h-screen w-full">
      
//             <button
//               onClick={() => setShowModal(true)}
//               className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-400 ml-auto text-sm"
//             >
//               Add Product
//             </button>
//           </div>
//         )}


//         {/* Render the modal */}
//         {renderModal()}
//         {/* Render the edit modal */}
//         {renderEditModal()}
//       </div>
//       <ErrorModal
//         isOpen={isErrorModalOpen}
//         onClose={() => setIsErrorModalOpen(false)}
//       />
//     </div>
//   );
// };

// export default AdminPanel;
