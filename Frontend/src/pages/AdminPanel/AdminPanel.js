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

  // State for handling product form and edit mode
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const initialProductState = {
    name: "",
    brand: "",
    deviceType: "",
    price: "",
    thumbnail: "",
    slug: "",
    description: "",
    variants: [{ color: "", size: "", stockQuantity: 0 }],
    productResources: [{ name: "", url: "", type: "" }],
    newArrival: false,
  };
  
  // Simulated API calls
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
      // Update the state with the fetched products
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

  // Fetch data when tab changes
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

  // const handleUpdate = (id, type) => {
  //   alert(`Update clicked for ID ${id} in ${type}`);
  // };

  const handleAddProduct = (e) => {
    e.preventDefault();

    const product = {
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      brand: newProduct.brand,
      newArrival: true,
      rating: 4,
      categoryId: "edb0c4b4-6e85-404e-a8d0-72857b1c4395",
      thumbnail: "https://example.com/images/mac_pro_8core.jpg",
      slug: newProduct.slug,
      categoryName: newProduct.deviceType,
      categoryTypeId: "49cc3d90-606d-4851-8cd7-934a1434f756",
      categoryTypeName: newProduct.brand,
      variants: [
        {
          color: newProduct.variantsColor,
          size: newProduct.variantsSize,
          stockQuantity: newProduct.variantsStockQuantity,
        },
      ],
      productResources: [
        {
          name: newProduct.productResourceName,
          url: newProduct.productResourceUrl,
          type: newProduct.productResourceType,
          isPrimary: true,
        },
      ],
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
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(product),
    })
      .then((response) => {
        if (response.ok) {
          // Parse the response as JSON
          return response.json();
        }
        throw new Error("Failed to add product");
      })
      .then((data) => {
        console.log("Product added:", data);
        setProducts([...products, data]);
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
          categoryTypeName: "",
          variants: [
            {
              color: "",
              size: "",
              stockQuantity: "",
            },
          ],
          productResources: [
            {
              name: "",
              url: "",
              type: "",
              isPrimary: "",
            },
          ],
        });
        alert("Product added successfully");
        setNewProduct(initialProductState);
        // setShowModal(false); // Close the modal after submission
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        alert("Error adding product");
      });
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    // Update the products state with the edited product
    setProducts(
      products.map((product) =>
        product.id === editProduct.id ? { ...editProduct } : product
      )
    );
    setShowEditModal(false);
    alert("Product updated successfully");
    setNewProduct(initialProductState);
    setShowModal(false);
  };

  // // Set the product being edited
  // const handleEdit = (product) => {
  //   // Set the product being edited
  //   setEditProduct(product);
  //   // Populate the form with the product details
  //   setNewProduct({ ...product });
  // };

  const renderModal = () => {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 ${
          !showModal && "hidden"
        }`}
        onClick={() => setShowModal(false)}
      >
        <div
          className="bg-gray-900 text-white p-6 rounded-lg w-2/3 md:w-1/2"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold mb-4">
            {editProduct ? "Edit Product" : "Add Product"}
          </h2>
          <form
            onSubmit={editProduct ? handleUpdateProduct : handleAddProduct}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
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
                className="w-full p-2 mb-4 border border-gray-700 rounded bg-gray-900 text-white text-sm"
                required
              />

              {/* Brand Dropdown */}
              {/* <label className="block text-white text-sm mb-2">Brand</label> */}
              <select
                name="brand"
                value={editProduct ? editProduct.brand : newProduct.brand}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    brand: e.target.value,
                  })
                }
                className="w-full p-2 mb-4 border border-gray-700 rounded bg-gray-900 text-white text-sm"
                required
              >
                <option value="" disabled selected>
                  Select a Brand
                </option>
                <option value="Apple">Apple</option>
                <option value="Asus">Asus</option>
                <option value="Acer">Acer</option>
                <option value="Dell">Dell</option>
                <option value="HP">HP</option>
                <option value="Lenovo">Lenovo</option>
                <option value="Microsoft">Microsoft</option>
                <option value="MSI">MSI</option>
                <option value="Samsung">Samsung</option>
              </select>

              {/* Device Type Dropdown */}
              {/* <label className="block text-white text-sm mb-2">
                Device Type
              </label> */}
              <select
                name="deviceType"
                value={
                  editProduct ? editProduct.deviceType : newProduct.deviceType
                }
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    deviceType: e.target.value,
                  })
                }
                className="w-full p-2 mb-4 border border-gray-700 rounded bg-gray-900 text-white text-sm"
                required
              >
                <option value="" disabled selected>
                  Select a Device Type
                </option>
                <option value="Desktop">Desktop</option>
                <option value="Laptop">Laptop</option>
              </select>

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
                className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
                required
              />
              {/* <input
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
                className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
                required
              /> */}
              <input
                type="url"
                name="thumbnail"
                placeholder="Thumbnail URL"
                value={
                  editProduct ? editProduct.thumbnail : newProduct.thumbnail
                }
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    thumbnail: e.target.value,
                  })
                }
                className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
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
                className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
              />
              <textarea
                name="description"
                placeholder="Description"
                value={
                  editProduct ? editProduct.description : newProduct.description
                }
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
                required
              />

              {/* <input
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
                className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
                required
              /> */}
            </div>

            {/* Right Column */}
            <div>
              {/* New Fields */}

              {/* Variants */}
              <div className="mb-6">
                <label className="block text-white text-sm mb-2">
                  Product Variants
                </label>
                <input
                  type="text"
                  name="variantsColor"
                  placeholder="Variant Color"
                  value={
                    editProduct
                      ? editProduct.variants?.[0]?.color
                      : newProduct.variants?.[0]?.color
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      variants: (newProduct.variants || []).map(
                        (variant, index) =>
                          index === 0
                            ? { ...variant, color: e.target.value } // Update only the color field
                            : variant // Keep the other variants unchanged
                      ),
                    })
                  }
                  className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
                />

                <input
                  type="text"
                  name="variantsSize"
                  placeholder="Variant Size"
                  value={
                    editProduct
                      ? editProduct.variants?.[0]?.size
                      : newProduct.variants?.[0]?.size
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      variants: (newProduct.variants || []).map(
                        (variant, index) =>
                          index === 0
                            ? { ...variant, size: e.target.value } // Update only the size field
                            : variant // Keep the other variants unchanged
                      ),
                    })
                  }
                  className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
                />

                <input
                  type="number"
                  name="variantsStockQuantity"
                  placeholder="Variant Stock Quantity"
                  value={
                    editProduct
                      ? editProduct.variants?.[0]?.stockQuantity
                      : newProduct.variants?.[0]?.stockQuantity
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      variants: (newProduct.variants || []).map(
                        (variant, index) =>
                          index === 0
                            ? { ...variant, stockQuantity: e.target.value } // Update only the stockQuantity field
                            : variant // Keep the other variants unchanged
                      ),
                    })
                  }
                  className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
                />
              </div>
              {/* Product Resources */}
              <div className="mb-4">
                <label className="block text-white text-sm mb-2">
                  Product Resources
                </label>
                <input
                  type="text"
                  name="productResourceName"
                  placeholder="Resource Name"
                  value={
                    editProduct
                      ? editProduct.productResources?.[0]?.name
                      : newProduct.productResources?.[0]?.name
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      productResources: [
                        {
                          ...newProduct.productResources?.[0],
                          name: e.target.value,
                        },
                      ],
                    })
                  }
                  className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
                />
                <input
                  type="url"
                  name="productResourceUrl"
                  placeholder="Product Resource URL"
                  value={
                    editProduct
                      ? editProduct.productResources?.[0]?.url
                      : newProduct.productResources?.[0]?.url
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      productResources: [
                        {
                          ...newProduct.productResources?.[0],
                          url: e.target.value,
                        },
                      ],
                    })
                  }
                  className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
                />
                <input
                  type="text"
                  name="productResourceType"
                  placeholder="Resource Type (PDF, Image, etc.)"
                  value={
                    editProduct
                      ? editProduct.productResources?.[0]?.type
                      : newProduct.productResources?.[0]?.type
                  }
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      productResources: [
                        {
                          ...newProduct.productResources?.[0],
                          type: e.target.value,
                        },
                      ],
                    })
                  }
                  className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
                />
                {/* <label className="block text-white mb-2">
                  <input
                    type="checkbox"
                    name="productResourceIsPrimary"
                    checked={
                      editProduct
                        ? editProduct.productResources?.[0]?.isPrimary
                        : newProduct.productResources?.[0]?.isPrimary
                    }
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        productResources: [
                          {
                            ...newProduct.productResources?.[0],
                            isPrimary: e.target.checked,
                          },
                        ],
                      })
                    }
                    className="mr-2"
                  />
                  Primary Resource
                </label> */}
              </div>
              <label className="text-white">
                <input
                  type="checkbox"
                  name="newArrival"
                  checked={
                    editProduct ? editProduct.newArrival : newProduct.newArrival
                  }
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

  const renderEditModal = () => {
    return (
      <div
        className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 ${
          !showEditModal && "hidden"
        }`}
        onClick={() => setShowEditModal(false)}
      >
        <div
          className="bg-gray-900 text-white p-6 rounded-lg w-1/2"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
          <form onSubmit={handleUpdateProduct}>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={editProduct ? editProduct.name : ""}
              onChange={(e) =>
                setEditProduct({ ...editProduct, name: e.target.value })
              }
              className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={editProduct ? editProduct.price : ""}
              onChange={(e) =>
                setEditProduct({ ...editProduct, price: e.target.value })
              }
              className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
              required
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={editProduct ? editProduct.category : ""}
              onChange={(e) =>
                setEditProduct({ ...editProduct, category: e.target.value })
              }
              className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
              required
            />
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              value={editProduct ? editProduct.stock : ""}
              onChange={(e) =>
                setEditProduct({ ...editProduct, stock: e.target.value })
              }
              className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
              required
            />
            <button
              type="submit"
              className="w-full py-3 text-white bg-gray-800 rounded hover:bg-gray-700"
            >
              Update Product
            </button>
          </form>
          <button
            className="absolute top-2 right-2 text-white"
            onClick={() => setShowEditModal(false)}
          >
            &times;
          </button>
        </div>
      </div>
    );
  };

  const renderTable = (data, type) => {
    const getDisplayValue = (item, key) => {
      // If the value is an object, handle it appropriately
      if (typeof item[key] === "object" && item[key] !== null) {
        // If it's an array, join the values
        if (Array.isArray(item[key])) {
          return item[key].map((obj) => obj.name || obj.value || "").join(", ");
        }
        // For other objects, return a placeholder or relevant property
        return item[key].name || item[key].value || JSON.stringify(item[key]);
      }
      // For non-object values, return as is
      return item[key];
    };

    const columns = {
      products: [
        "id",
        "slug",
        "brand",
        "price",
        "rating",
        "description",
        "Actions",
      ],
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
                // Skip rendering for "Actions" column
                if (col === "Actions") {
                  return (
                    <td key={col} className="px-6 py-4 text-white text-sm">
                      <div className="flex gap-2">
                        <button
                          className="flex-1 px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-500"
                          onClick={() => {
                            setEditProduct(item);
                            setShowEditModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="flex-1 px-4 py-2 text-white bg-red-600 rounded hover:bg-red-500"
                          onClick={() => handleDelete(item.id, type)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  );
                }

                // For other columns, render the value
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
    <div className="flex p-8 bg-gray-900 min-h-screen w-full">
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
      <div className="flex-1 p-6 ml-6 bg-gray-900 text-white rounded-lg ">
        {/* Only show "Add Product" button if the "products" tab is active */}
        {activeTab === "products" && (
          <div className="flex items-center mb-6 w-full">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-400 ml-auto"
            >
              Add Product
            </button>
          </div>
        )}

        {activeTab === "products" && renderTable(products, "products")}
        {activeTab === "categories" && renderTable(categories, "categories")}
        {activeTab === "orders" && renderTable(orders, "orders")}
        {activeTab === "transactions" &&
          renderTable(transactions, "transactions")}
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "marketing" && renderMarketing()}
        {activeTab === "reports" && renderReports()}

        {/* Render the modal */}
        {renderModal()}
        {/* Render the edit modal */}
        {renderEditModal()}
      </div>
    </div>
  );
};

export default AdminPanel;
