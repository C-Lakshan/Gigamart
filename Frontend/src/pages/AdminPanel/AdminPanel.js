import React, { useState, useEffect } from "react";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    users: 100,
    sales: 5000,
  });
  const [marketingData, setMarketingData] = useState({
    campaigns: 3,
    leads: 250,
  });
  const [reportsData, setReportsData] = useState({ salesReport: "Q1 Report" });
  const [showModal, setShowModal] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);


  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/products"); 
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json(); 
      console.log("Fetched products:", data);

      const filteredData = data.map((product) => ({
        id: product.id,
        slug: product.slug,
        brand: product.brand,
        price: product.price,
        rating: product.rating,
        // newArrival: product.newArrival,
        description: product.description,
      }));
      // console.log('Fetched products:', filteredData);
      setProducts(filteredData); 
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    const data = [
      { id: 1, name: "Electronics", description: "Electronic goods" },
      { id: 2, name: "Clothing", description: "Fashion items" },
    ];
    setCategories(data);
  };

  const fetchOrders = async () => {
    const data = [
      {
        id: 1,
        customer: "John Doe",
        status: "Pending",
        total: 299.97,
        date: "2024-01-25",
      },
      {
        id: 2,
        customer: "Jane Smith",
        status: "Delivered",
        total: 149.99,
        date: "2024-01-26",
      },
    ];
    setOrders(data);
  };

  const fetchTransactions = async () => {
    const data = [
      {
        id: 1,
        orderId: 1,
        amount: 299.97,
        status: "Completed",
        date: "2024-01-25",
      },
      {
        id: 2,
        orderId: 2,
        amount: 149.99,
        status: "Completed",
        date: "2024-01-26",
      },
    ];
    setTransactions(data);
  };

  useEffect(() => {
    if (activeTab === "products") fetchProducts();
    if (activeTab === "categories") fetchCategories();
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "transactions") fetchTransactions();
  }, [activeTab]);

  const handleDelete = (id, type) => {
    if (type === "products")
      setProducts(products.filter((product) => product.id !== id));
    if (type === "categories")
      setCategories(categories.filter((category) => category.id !== id));
    if (type === "orders") setOrders(orders.filter((order) => order.id !== id));
    if (type === "transactions")
      setTransactions(
        transactions.filter((transaction) => transaction.id !== id)
      );
    alert(`Item with ID ${id} deleted from ${type}`);
  };

  const handleUpdate = (id, type) => {
    alert(`Update clicked for ID ${id} in ${type}`);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
  
    const product = {
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      brand: newProduct.brand,
      newArrival: true,
      rating: newProduct.rating,
      categoryId: "edb0c4b4-6e85-404e-a8d0-72857b1c4395",
      thumbnail: "https://example.com/images/mac_pro_8core.jpg",
      slug: newProduct.slug,
      categoryName: "Desktop",
      categoryTypeId: "49cc3d90-606d-4851-8cd7-934a1434f756",
      categoryTypeName: "Apple",
      variants: [
        {
          "color": "Silver",
          "size": "Standard",
          "stockQuantity": 25
        }
      ],
      "productResources": [
        {
          "name": "User Manual",
          "url": "https://www.dpsb.co.uk/app/uploads/2022/01/Apple_Mac_Pro_2019_1000_0001.jpeg",
          "type": "PDF",
          "isPrimary": true
        }
      ]
    };
  
    // Retrieve the JWT token from localStorage
    const authToken = localStorage.getItem("authToken");
    console.log(authToken);
    // POST request to the API
    fetch("http://localhost:8080/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Include the Authorization header with the Bearer token
        "Authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify(product), // Send the product object as a JSON string
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse the response as JSON
        }
        throw new Error("Failed to add product");
      })
      .then((data) => {
        console.log("Product added:", data); // Handle successful response
        // Optionally, update the local state if you want to add it to the UI immediately
        setProducts([...products, data]); // Assuming the response includes the added product
        setNewProduct({
          name: "",
          description: "",
          price: "",
          brand: "",
          newArrival: false,
          rating: "",
          categoryId: "",
          thumbnail: "",
          slug: "",
          categoryName: "",
          categoryTypeId: "",
          categoryTypeName: ""
          
        });
        alert("Product added successfully");
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        alert("Error adding product");
      });
  };
  

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    setProducts(products.map((product) =>
      product.id === editProduct.id ? { ...editProduct } : product
    ));
    setShowEditModal(false); 
    alert('Product updated successfully');
  };

  const handleEdit = (product) => {
    setEditProduct(product); 
    setNewProduct({ ...product }); 
  };

  const renderModal = () => {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 ${!showModal && "hidden"}`}
        onClick={() => setShowModal(false)}
      >
        <div
          className="bg-gray-900 text-white p-6 rounded-lg w-2/3 md:w-1/2"
          onClick={(e) => e.stopPropagation()} 
        >
          <h2 className="text-xl font-semibold mb-4">
            {editProduct ? "Edit Product" : "Add Product"}
          </h2>
          <form onSubmit={editProduct ? handleUpdateProduct : handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Left Column */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={editProduct ? editProduct.name : newProduct.name}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    name: e.target.value,
                  })
                }
                className="w-full p-3 mb-4 border border-gray-700 rounded bg-gray-900 text-white"
                required
              />
              
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={editProduct ? editProduct.price : newProduct.price}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    price: e.target.value,
                  })
                }
                className="w-full p-3 mb-4 border border-gray-700 rounded bg-gray-900 text-white"
                required
              />
              <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={editProduct ? editProduct.brand : newProduct.brand}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    brand: e.target.value,
                  })
                }
                className="w-full p-3 mb-4 border border-gray-700 rounded bg-gray-900 text-white"
                required
              />
              <input
                type="url"
                name="thumbnail"
                placeholder="Thumbnail URL"
                value={editProduct ? editProduct.thumbnail : newProduct.thumbnail}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    thumbnail: e.target.value,
                  })
                }
                className="w-full p-3 mb-4 border border-gray-700 rounded bg-gray-900 text-white"
              />
            




              <input
                type="text"
                name="slug"
                placeholder="Slug"
                value={editProduct ? editProduct.slug : newProduct.slug}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    slug: e.target.value,
                  })
                }
                className="w-full p-3 mb-4 border border-gray-700 rounded bg-gray-900 text-white"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={editProduct ? editProduct.description : newProduct.description}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    description: e.target.value,
                  })
                }
                className="w-full p-3 mb-4 border border-gray-700 rounded bg-gray-900 text-white"
                required
              />
              <label className="block text-white mb-2">Category</label>
              
              <input
                type="number"
                name="rating"
                placeholder="Rating"
                value={editProduct ? editProduct.rating : newProduct.rating}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    rating: e.target.value,
                  })
                }
                className="w-full p-3 mb-4 border border-gray-700 rounded bg-gray-900 text-white"
                required
              />

              </div>
              
              {/* Right Column */}
              <div>
              <label className="text-white">
                <input
                  type="checkbox"
                  name="newArrival"
                  checked={editProduct ? editProduct.newArrival : newProduct.newArrival}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      newArrival: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                New Arrival
              </label>

              
              
            </div>
  
            <button
              type="submit"
              className="w-full py-3 text-white bg-gray-800 rounded hover:bg-gray-700 mt-4"
            >
              {editProduct ? "Update Product" : "Add Product"}
            </button>
          </form>
          <button
            className="absolute top-2 right-2 text-white"
            onClick={() => setShowModal(false)} 
          >
            &times;
          </button>
        </div>
      </div>
    );
  };

  const renderTable = (data, type) => {
    const getDisplayValue = (item, key) => {
      if (typeof item[key] === 'object' && item[key] !== null) {
        if (Array.isArray(item[key])) {
          return item[key].map(obj => obj.name || obj.value || '').join(', ');
        }
        return item[key].name || item[key].value || JSON.stringify(item[key]);
      }
      return item[key];
    };
  
    const columns = {
      products: ["id", "slug", "brand", "price", "rating", "description", "Actions"],
      categories: ["ID", "Name", "Description", "Actions"],
      orders: ["ID", "Customer", "Status", "Total", "Date", "Actions"],
      transactions: ["ID", "Order ID", "Amount", "Status", "Date", "Actions"],
    };
  
    return (
      <table className="w-full table-auto border-separate border-spacing-0">
        <thead>
          <tr className="bg-gray-800 text-white">
            {columns[type].map((col) => (
              <th key={col} className="px-6 py-3 text-left font-semibold">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="bg-gray-700 hover:bg-gray-600">
              {columns[type].map((col) => {
                if (col === "Actions") {
                  return (
                    <td key={col} className="px-6 py-4 text-white text-sm">
                      <button
                        className="px-4 py-2 mr-2 text-white bg-gray-600 rounded hover:bg-gray-500"
                        onClick={() => {
                          
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-500"
                        onClick={() => handleDelete(item.id, type)}
                      >
                        Delete
                      </button>
                    </td>
                  );
                }
                
                const key = col.toLowerCase();
                return (
                  <td key={col} className="px-6 py-4 text-white text-sm">
                    {getDisplayValue(item, key)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderCard = (title, value) => {
    return (
      <div className="w-1/3 p-6 bg-gray-800 text-white rounded shadow-lg">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-2xl">{value}</p>
      </div>
    );
  };

  const renderDashboard = () => {
    return (
      <div className="flex space-x-6 mb-6">
        {renderCard("Users", dashboardData.users)}
        {renderCard("Sales", `$${dashboardData.sales}`)}
      </div>
    );
  };

  const renderMarketing = () => {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Marketing</h2>
        <p>Active Campaigns: {marketingData.campaigns}</p>
        <p>Leads Generated: {marketingData.leads}</p>
      </div>
    );
  };

  const renderReports = () => {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Reports</h2>
        <p>Report: {reportsData.salesReport}</p>
      </div>
    );
  };

  return (
    <div className="flex p-8 bg-gray-900">
      {/* Sidebar */}
      <div className="w-1/4 p-4 bg-gray-800 text-white rounded-lg">
        <h2 className="mb-6 text-xl font-bold">Admin Panel</h2>
        <ul className="space-y-4">
          {[
            "products",
            "categories",
            "orders",
            "transactions",
            "dashboard",
            "marketing",
            "reports",
          ].map((tab) => (
            <li key={tab}>
              <button
                className={`w-full text-left p-3 rounded-md ${
                  activeTab === tab ? "bg-gray-600" : "hover:bg-gray-700"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 ml-6 bg-gray-900 text-white rounded-lg justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="mb-6 px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-500"
          >
            Add Product
          </button>
        {activeTab === "products" && (
          <>
            {renderTable(products, "products")}
          </>
        )}
        {activeTab === "categories" && renderTable(categories, "categories")}
        {activeTab === "orders" && renderTable(orders, "orders")}
        {activeTab === "transactions" &&
          renderTable(transactions, "transactions")}
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "marketing" && renderMarketing()}
        {activeTab === "reports" && renderReports()}

      </div>
    </div>
  );
};

export default AdminPanel;
