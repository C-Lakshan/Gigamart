import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "../../api/constant";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  DollarSign,
  ShoppingCart,
  Package,
  RefreshCw,
} from "lucide-react";
import { PencilIcon, TrashIcon } from "@heroicons/react/solid";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HOME_URL = "http://localhost:3000/";
// const BASE_URL = "http://localhost:8080/";
// const BASE_URL = "http://localhost:8000/";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  // const [dashboardData, setDashboardData] = useState({
  //   users: 100,
  //   sales: 5000,
  //   totalCustomers: 50,
  //   totalOrders: 120,
  //   totalTransactions: 200,
  //   transactionsPerMonth: [
  //     80, 60, 80, 120, 115, 150, 130, 150, 120, 200, 180, 210,
  //   ], // Sample transaction data for the graph
  // });

  // Initialize as null to handle loading state
  // const [dashboardData, setDashboardData] = useState(null);

  const [dashboardData, setDashboardData] = useState({
    users: 0,
    sales: 0,
    totalCustomers: 0,
    totalOrders: 0,
    totalTransactions: 0,
    monthlySales: [],
  });

  const [marketingData, setMarketingData] = useState({
    campaigns: 3,
    leads: 250,
  });
  const [reportsData, setReportsData] = useState({ salesReport: "Q1 Report" });
  const [showModal, setShowModal] = useState(false);
  const [searchSlug, setSearchSlug] = useState("");

  const [newProduct, setNewProduct] = useState({
    // name: "",
    // price: "",
    // category: "",
    // stock: "",
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Confirm Deletion
          </h2>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this item? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
              onClick={onConfirm}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ErrorModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">
            Error deleting the item. Please try again.
          </p>
          <div className="flex justify-end">
            <button
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    );
  };

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

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortedData = (data, type) => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle numeric values
      if (!isNaN(aValue) && !isNaN(bValue)) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        // Convert to strings for alphabetical sorting
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  const SortIndicator = ({ column }) => {
    if (sortConfig.key !== column) {
      return <span className="ml-1 text-gray-400">↕</span>;
    }
    return (
      <span className="ml-1">{sortConfig.direction === "asc" ? "↑" : "↓"}</span>
    );
  };

  const fetchProducts = async () => {
    const url = API_BASE_URL + "/api/products";
    try {
      const result = await axios(url, {
        method: "GET",
      });

      const filteredData = result?.data.map((product) => ({
        id: product.id,
        slug: product.slug,
        brand: product.brand,
        price: product.price,
        rating: product.rating,
        description: product.description,
      }));

      setProducts(filteredData);
      return filteredData;
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    const url = API_BASE_URL + "/api/category";
    try {
      const result = await axios(url, {
        method: "GET",
      });

      const allCategories = result?.data.map((category) => ({
        id: category.id,
        name: category.name,
      }));

      console.log("Processed device types:", allCategories);
      setDeviceTypes(allCategories);

      return result.data;
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  const fetchBrandsByDeviceType = (deviceTypeId) => {
    const url = API_BASE_URL + "/api/category";
    axios(url, {
      method: "GET",
    })
      .then((result) => {
        console.log("Looking for device type with ID:", deviceTypeId);

        const selectedCategory = result.data.find(
          (category) => category.id === deviceTypeId
        );

        console.log("Found category:", selectedCategory);

        if (selectedCategory) {
          const brands = selectedCategory.categoryTypes.map((brand) => ({
            id: brand.id,
            name: brand.name,
          }));

          console.log("Processed brands for selected category:", brands);
          setCategories(brands);
        }
      })
      .catch((error) => {
        console.log("Error fetching brands:", error);
      });
  };

  const fetchOrders = async () => {
    const url = API_BASE_URL + "/api/order";
    try {
      const response = await axios(url, {
        method: "GET",
        headers: getHeaders(),
      });

      const filteredDataOrders = response?.data.map((order) => ({
        id: order.id,
        totalAmount: order.totalAmount,
        orderStatus: order.orderDate,
        name: order.address?.name,
        addressId: order.address?.id,
      }));

      setOrders(filteredDataOrders);
      return filteredDataOrders;
    } catch (err) {
      throw new Error(err);
    }
  };

  const fetchTransactions = async () => {
    const url = API_BASE_URL + "/api/payment";
    try {
      const response = await axios(url, {
        method: "GET",
        headers: getHeaders(),
      });

      const filteredData = response?.data.map((transaction) => ({
        id: transaction.id,
        orderId: transaction.orderId,
        paymentDate: transaction.paymentDate,
        amount: transaction.amount,
        paymentMethod: transaction.paymentMethod,
        paymentStatus: transaction.paymentStatus,
      }));

      setTransactions(filteredData);
      return filteredData;
    } catch (err) {
      throw new Error(err);
    }
  };

  const fetchUsers = async () => {
    const url = API_BASE_URL + "/api/user/all";
    try {
      const response = await axios(url, {
        method: "GET",
        headers: getHeaders(),
      });

      const filteredUserData = response?.data.map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phoneNo: user.phoneNumber,
        role: user.authorityList?.[0]?.roleCode || "USER",
        address: user.addressList?.[0]?.state || "N/A",
      }));

      setUsers(filteredUserData);
      return filteredUserData;
    } catch (err) {
      throw new Error(err);
    }
  };

  const fetchDashboardStats = async () => {
    const url = API_BASE_URL + "/api/payment/dashboard-stats";
    try {
      const response = await axios(url, {
        method: "GET",
        headers: getHeaders(),
      });

      const dashboardData = {
        users: response?.data.totalUsers,
        sales: response?.data.totalSales,
        totalCustomers: response?.data.totalCustomers,
        totalOrders: response?.data.totalOrders,
        totalTransactions: response?.data.totalTransactions,
        monthlySales: response?.data.monthlySales,
      };

      setDashboardData(dashboardData);
      return dashboardData;
    } catch (err) {
      throw new Error(err);
    }
  };

  useEffect(() => {
    if (activeTab === "products") fetchProducts();
    if (activeTab === "categories") fetchCategories();
    if (activeTab === "orders") fetchOrders();
    if (activeTab === "transactions") fetchTransactions();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "dashboard") fetchDashboardStats();
  }, [activeTab]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        // `${API_BASE_URL}/api/products?slug=${searchSlug}`
        `${API_BASE_URL}/api/products/searchProductsBySlugPart?slugPart=${searchSlug}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      const filteredData = data.map((product) => ({
        id: product.id,
        slug: product.slug,
        brand: product.brand,
        price: product.price,
        rating: product.rating,
        description: product.description,
      }));

      setProducts(filteredData);
    } catch (error) {
      console.error("Error searching products:", error);
      alert("Error searching products");
    }
  };

  const handleDelete = (id, type) => {
    setItemToDelete({ id, type });
    setShowConfirmModal(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!itemToDelete) return;

    const { id, type } = itemToDelete;
    try {
      let url = "";
      if (type === "products") {
        url = `${API_BASE_URL}/api/products/${id}`;
      } else if (type === "categories") {
        url = `${API_BASE_URL}/api/categories/${id}`;
      } else if (type === "orders") {
        url = `${API_BASE_URL}/api/orders/${id}`;
      } else if (type === "transactions") {
        url = `${API_BASE_URL}/api/transactions/${id}`;
      }

      const response = await fetch(url, { method: "DELETE" });

      if (response.ok) {
        if (type === "products") {
          setProducts(products.filter((product) => product.id !== id));
        } else if (type === "categories") {
          setCategories(categories.filter((category) => category.id !== id));
        } else if (type === "orders") {
          setOrders(orders.filter((order) => order.id !== id));
        } else if (type === "transactions") {
          setTransactions(
            transactions.filter((transaction) => transaction.id !== id)
          );
        }
        // alert(`Item with ID ${id} deleted from ${type}`);
      } else {
        // alert("Error deleting the item. Please try again.");
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error("Error:", error);
      // alert("An error occurred while deleting the item.");
      setIsErrorModalOpen(true);
    }

    setShowConfirmModal(false);
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
      brand: newProduct.brandName,
      newArrival: true,
      rating: 4,
      categoryId: newProduct.deviceType,
      thumbnail: newProduct.thumbnail,
      slug: newProduct.slug,
      categoryName: newProduct.deviceTypeName,
      categoryTypeId: newProduct.brand,
      categoryTypeName: newProduct.brandName,
      variants: [
        {
          color: newProduct.colour,
          size: newProduct.size,
          stockQuantity: newProduct.quantity,
        },
      ],
      productResources: [
        {
          name: newProduct.ResourceName,
          url: newProduct.ResourceUrl,
          type: newProduct.ResourceType,
          isPrimary: true,
        },
      ],
    };

    console.log(product);
    // Retrieve the JWT token from localStorage
    const authToken = localStorage.getItem("authToken");
    console.log(authToken);
    // POST request to the API
    fetch(`${API_BASE_URL}/api/products`, {
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
              {/* Device Type Dropdown */}
              <select
                name="deviceType"
                value={
                  editProduct ? editProduct.deviceType : newProduct.deviceType
                }
                onChange={(e) => {
                  const selectedDeviceTypeId = e.target.value;
                  const selectedDeviceTypeName =
                    e.target.options[e.target.selectedIndex].text;
                  console.log("Selected Device Type ID:", selectedDeviceTypeId);
                  console.log(
                    "Selected Device Type Name:",
                    e.target.options[e.target.selectedIndex].text
                  );

                  setNewProduct({
                    ...newProduct,
                    deviceType: selectedDeviceTypeId,
                    deviceTypeName: selectedDeviceTypeName, 
                    // Reset brand when device type changes
                    brand: "",
                  });
                  fetchBrandsByDeviceType(selectedDeviceTypeId);
                }}
                onClick={() => {
                  // Only fetch if device types are not already loaded
                  if (deviceTypes.length === 0) {
                    fetchCategories();
                  }
                }}
                className="w-full p-2 mb-4 border border-gray-700 rounded bg-gray-900 text-white text-sm"
                required
              >
                <option value="" disabled selected>
                  Select a Device Type
                </option>
                {deviceTypes.map((deviceType) => (
                  <option key={deviceType.id} value={deviceType.id}>
                    {deviceType.name}
                  </option>
                ))}
              </select>

              {/* Brand Dropdown */}
              <select
                name="brand"
                value={editProduct ? editProduct.brand : newProduct.brand}
                onChange={(e) => {
                  const selectedBrandId = e.target.value;
                  const selectedBrandName =
                    e.target.options[e.target.selectedIndex].text;

                  console.log("Selected Brand ID:", selectedBrandId);
                  console.log("Selected Brand Name:", selectedBrandName);
                  console.log(
                    "Selected Brand Name:",
                    e.target.options[e.target.selectedIndex].text
                  );

                  setNewProduct({
                    ...newProduct,
                    brand: selectedBrandId,
                    brandName: selectedBrandName, 
                  });
                }}
                className="w-full p-2 mb-4 border border-gray-700 rounded bg-gray-900 text-white text-sm"
                // Disable until device type is selected
                disabled={!newProduct.deviceType} 
                required
              >
                <option value="" disabled selected>
                  Select a Brand
                </option>
                {categories.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
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
              
            </div>

            {/* Right Column */}
            <div>
              <label className="block text-white text-sm mb-2">
                Product Variants
              </label>
              <input
                type="text"
                name="colour"
                placeholder="Varient Colour"
                value={editProduct ? editProduct.colour : newProduct.colour}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    colour: e.target.value,
                  })
                }
                className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
              />

              <input
                type="text"
                name="size"
                placeholder="Varient size"
                value={editProduct ? editProduct.size : newProduct.size}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    size: e.target.value,
                  })
                }
                className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
              />
              <input
                type="text"
                name="quantity"
                placeholder="Varient Quantity"
                value={editProduct ? editProduct.quantity : newProduct.quantity}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    quantity: e.target.value,
                  })
                }
                className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
              />

              {/* Product Resources */}
              <label className="block text-white text-sm mb-2">
                Product Resources
              </label>
              <input
                type="text"
                name="ResourceName"
                placeholder="Resource Name"
                value={
                  editProduct ? editProduct.ResourceName : newProduct.ResourceName
                }
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    ResourceName: e.target.value,
                  })
                }
                className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
              />

              <input
                type="text"
                name="ResourceUrl"
                placeholder="Resource Url"
                value={
                  editProduct ? editProduct.ResourceUrl : newProduct.ResourceUrl
                }
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    ResourceUrl: e.target.value,
                  })
                }
                className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
              />
              <input
                type="text"
                name="ResourceType"
                placeholder="Resource Type"
                value={
                  editProduct ? editProduct.ResourceType : newProduct.ResourceType
                }
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    ResourceType: e.target.value,
                  })
                }
                className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
              />
              
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
            <textarea
              name="description"
              placeholder="Product Description"
              value={editProduct ? editProduct.description : ""}
              onChange={(e) =>
                setEditProduct({ ...editProduct, description: e.target.value })
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
              name="thumbnail"
              placeholder="Thumbnail URL"
              value={editProduct ? editProduct.thumbnail : ""}
              onChange={(e) =>
                setEditProduct({ ...editProduct, thumbnail: e.target.value })
              }
              className="w-full p-2 mb-2 border border-gray-700 rounded bg-gray-900 text-white text-sm"
              required
            />
            <input
              type="number"
              name="variantQuantity"
              placeholder="Variant Quantity"
              value={editProduct ? editProduct.variantQuantity : ""}
              onChange={(e) =>
                setEditProduct({ ...editProduct, variantQuantity: e.target.value })
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

  const columns = {
    products: [
      "ID",
      "Slug",
      "Brand",
      "Price",
      "Rating",
      "Description",
      "Actions",
    ],
    categories: ["ID", "Name", "Description", "Actions"],
    orders: [
      { header: "Order ID", key: "id" },
      { header: "Amount", key: "totalAmount" },
      { header: "Order Created Date", key: "orderStatus" },
      { header: "User ID", key: "name" },
      { header: "Address ID", key: "addressId" },
      // { header: "Actions", key: "actions" },
    ],
    transactions: [
      { header: "Transactions ID", key: "id" },
      { header: "Order ID", key: "orderId" },
      { header: "Payment Date", key: "paymentDate" },
      { header: "Amount", key: "amount" },
      // { header: "Payment Method", key: "paymentMethod" },
      { header: "Payment Status", key: "paymentStatus" },
      // { header: "Actions", key: "actions" },
    ],
    users: [
      { header: "User ID", key: "id" },
      { header: "Name", key: "name" },
      { header: "E-mail", key: "email" },
      { header: "Phone No", key: "phoneNo" },
      { header: "State", key: "address" },
      { header: "Authority", key: "role" },
      // { header: "Actions", key: "actions" },
    ],
  };

  const renderTable = (data, type) => {
    const getDisplayValue = (item, column) => {
      if (column.key === "actions") return null;

      const value = item[column.key];
      if (typeof value === "object" && value !== null) {
        if (Array.isArray(value)) {
          return value.map((obj) => obj.name || obj.value || "").join(", ");
        }
        return value.name || value.value || JSON.stringify(value);
      }
      return value;
    };

    const tableColumns = columns[type];
    const isNewFormat = tableColumns[0]?.hasOwnProperty("header");
    const sortedData = getSortedData(data, type);

    // Show skeleton loader if data is not loaded yet
    const loading = !data || data.length === 0;

    return (
      <>
        <table className="w-full table-auto border-separate border-spacing-0">
          <thead>
            <tr className="bg-gray-800 text-white">
              {isNewFormat
                ? tableColumns.map((col) => (
                    <th
                      key={col.header}
                      className="px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-gray-700"
                      onClick={() =>
                        col.key !== "actions" && handleSort(col.key)
                      }
                    >
                      <div className="flex items-center">
                        {col.header}
                        {col.key !== "actions" && (
                          <SortIndicator column={col.key} />
                        )}
                      </div>
                    </th>
                  ))
                : tableColumns.map((col) => (
                    <th
                      key={col}
                      className="px-4 py-2 text-xs font-semibold cursor-pointer hover:bg-gray-700"
                      onClick={() =>
                        col !== "Actions" && handleSort(col.toLowerCase())
                      }
                    >
                      <div className="flex items-center">
                        {col}
                        {col !== "Actions" && (
                          <SortIndicator column={col.toLowerCase()} />
                        )}
                      </div>
                    </th>
                  ))}
            </tr>
          </thead>
          <tbody>
            {loading
              ? // Show skeleton loader while data is loading
                Array(10)
                  .fill(null)
                  .map((_, index) => (
                    <tr key={index} className="bg-gray-700 hover:bg-gray-600">
                      {tableColumns.map((_, i) => (
                        <td key={i} className="px-4 py-3 text-gray-300 text-xs">
                          <Skeleton height={20} width={`100%`} />
                        </td>
                      ))}
                    </tr>
                  ))
              : // Render row data after loading
                sortedData.map((item) => (
                  <tr key={item.id} className="bg-gray-700 hover:bg-gray-600">
                    {isNewFormat
                      ? tableColumns.map((col) => {
                          if (col.key === "actions") {
                            return (
                              <td
                                key={col.header}
                                className="px-4 py-3 text-white text-xs"
                              >
                                <div className="flex gap-2">
                                  <button
                                    className="flex-1 p-2 text-white bg-gray-600 rounded hover:bg-gray-500 text-xs"
                                    onClick={() => {
                                      setEditProduct(item);
                                      setShowEditModal(true);
                                    }}
                                  >
                                    <PencilIcon className="w-5 h-5" />
                                  </button>
                                  <button
                                    className="flex-1 p-2 text-white bg-red-600 rounded hover:bg-red-500 text-xs"
                                    onClick={() => handleDelete(item.id, type)}
                                  >
                                    <TrashIcon className="w-5 h-5" />
                                  </button>
                                </div>
                              </td>
                            );
                          }
                          return (
                            <td
                              key={col.header}
                              className="px-4 py-3 text-white text-xs"
                            >
                              {getDisplayValue(item, col)}
                            </td>
                          );
                        })
                      : tableColumns.map((col) => {
                          if (col === "Actions") {
                            return (
                              <td
                                key={col}
                                className="px-4 py-3 text-white text-xs"
                              >
                                <div className="flex gap-2">
                                  <button
                                    className="flex-1 p-2 text-white bg-gray-600 rounded hover:bg-gray-500 text-xs"
                                    onClick={() => {
                                      setEditProduct(item);
                                      setShowEditModal(true);
                                    }}
                                  >
                                    <PencilIcon className="w-5 h-5" />
                                  </button>
                                  <button
                                    className="flex-1 p-2 text-white bg-red-600 rounded hover:bg-red-500 text-xs"
                                    onClick={() => handleDelete(item.id, type)}
                                  >
                                    <TrashIcon className="w-5 h-5" />
                                  </button>
                                </div>
                              </td>
                            );
                          }
                          const key = col.toLowerCase();
                          return (
                            <td
                              key={col}
                              className="px-4 py-3 text-white text-xs"
                            >
                              {getDisplayValue(item, { key })}
                            </td>
                          );
                        })}
                  </tr>
                ))}
          </tbody>
        </table>
        <ConfirmationModal
          isOpen={showConfirmModal}
          onClose={() => setShowConfirmModal(false)}
          onConfirm={handleDeleteConfirmed}
        />
      </>
    );
  };

  const renderCard = (title, value, Icon) => {
    return (
      <div className="p-6 border-2 border-gray-600 shadow-lg rounded-lg flex flex-col items-center justify-center bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 border-2 border-gray-500 rounded-lg blur-md animate-pulse"></div>
        {/* Gray glowing border effect */}
        <div className="relative z-10 flex flex-col items-center">
          <Icon className="w-8 h-8 text-gray-400" />
          <h3 className="text-lg font-semibold mt-2 text-gray-300">{title}</h3>
          <p className="text-2xl font-bold text-gray-400">{value}</p>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    if (!dashboardData) {
      return (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-400">Loading dashboard data...</p>
        </div>
      );
    }
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {renderCard("Users", dashboardData.users, Users)}
          {renderCard(
            "Sales",
            `$${dashboardData.sales.toFixed(2)}`,
            DollarSign
          )}
          {renderCard(
            "Total Customers",
            dashboardData.totalCustomers,
            ShoppingCart
          )}
          {renderCard("Total Orders", dashboardData.totalOrders, Package)}
          {renderCard(
            "Total Transactions",
            dashboardData.totalTransactions,
            RefreshCw
          )}
        </div>
        {/* Line Chart */}
        <div className="p-6 bg-gray-900 rounded-lg shadow-lg border-2 border-gray-600">
          <h3 className="text-xl font-semibold mb-4 text-gray-300">
            Transactions Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={[
                ...(dashboardData.monthlySales || []).map((value, index) => ({
                  month: `M${index + 1}`,
                  value,
                })),
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="month" stroke="#bbb" />
              <YAxis stroke="#bbb" />
              <RechartsTooltip
                cursor={{ stroke: "#8f8f8f", strokeWidth: 2 }}
                contentStyle={{
                  backgroundColor: "#222",
                  borderRadius: "5px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8f8f8f"
                strokeWidth={3}
                dot={{ r: 5, fill: "#8f8f8f" }}
                activeDot={{ r: 7, stroke: "#8f8f8f" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
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
    // Function to handle exporting to PDF
    const exportToPDF = () => {
      const button = document.getElementById("export-btn");
      button.style.display = "none";

      const graphContent = document.getElementById("transaction-graph");

      html2canvas(graphContent).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.width;
        const pageHeight = pdf.internal.pageSize.height;
        let y = 30; // Initial Y position for content

        // Construct the reports data from the API data
        const reportsData = {
          totalSales: dashboardData.sales,
          totalOrders: dashboardData.totalOrders,
          avgOrderValue:
            (dashboardData.sales / dashboardData.totalOrders).toFixed(2) || 0, // Calculate average order value
          salesGrowth: 15,
          ordersCompleted: dashboardData.totalOrders,
          ordersPending: 3,
          topSellingProduct: "Wireless Mouse",
          customersThisMonth: dashboardData.totalCustomers,
          userCount: dashboardData.users,
          repeatCustomerRate: 10,
          customerDemographics: "Age 25-45, Tech-Savvy",
          ctr: 3.5,
          conversionRate: 2.8,
          socialMediaReach: "50,000+ Followers",
        };

        const currentDate = new Date().toLocaleString();
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.setTextColor(60, 60, 60);
        pdf.text("Gigamart Sales Report", 10, 20);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Generated on: ${currentDate}`, pageWidth - 80, 20);

        // Transactions Over Time Graph
        pdf.setFontSize(14);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(40, 40, 40);
        y += 8;
        pdf.addImage(imgData, "PNG", 10, y, pageWidth - 20, 80);
        y += 90;

        // Function to add a structured table
        const addTable = (title, data, startY) => {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(14);
          pdf.setTextColor(40, 40, 40);
          pdf.text(title, 20, startY);
          startY += 8;
          pdf.setFontSize(12);
          pdf.setFont("helvetica", "normal");

          pdf.setFillColor(230, 240, 255);
          pdf.rect(10, startY - 15, pageWidth - 20, 42, "F");

          data.forEach(([label, value]) => {
            pdf.text(`${label}:`, 25, startY);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(50, 50, 50);
            pdf.text(`${value}`, 80, startY);
            pdf.setFont("helvetica", "normal");
            startY += 7;
          });

          return startY + 5;
        };

        // Adding structured sections
        y = addTable(
          "Sales Overview",
          [
            ["Total Sales", `$${reportsData.totalSales.toFixed(2)}`],
            ["Number of Orders", reportsData.totalOrders],
            ["Average Order Value", `$${reportsData.avgOrderValue}`],
            // ["Sales Growth", `${reportsData.salesGrowth}%`],
          ],
          y
        );

        y = addTable(
          "Order Summary",
          [
            ["Orders count", reportsData.ordersCompleted],
            // ["Orders Pending", reportsData.ordersPending],
            // ["Top Selling Product", reportsData.topSellingProduct],
          ],
          y
        );

        y = addTable(
          "Customer Insights",
          [
            ["Customers this month", reportsData.customersThisMonth],
            ["Total Customers", reportsData.userCount],
            // ["Repeat Customer Rate", `${reportsData.repeatCustomerRate}%`],
            // ["Customer Demographics", reportsData.customerDemographics],
          ],
          y
        );

        // Footer with page number
        pdf.setFontSize(10);
        pdf.setTextColor(150, 150, 150); // Light gray for footer text
        pdf.text(
          `Page 1/${pdf.internal.getNumberOfPages()}`,
          pageWidth - 50,
          pageHeight - 10
        );

        // Save the PDF
        pdf.save("ecommerce_report.pdf");

        // Reset button visibility
        button.style.display = "inline-block";
      });
    };

    return (
      <div
        id="report-content"
        className="bg-gray-100 p-8 rounded-lg shadow-lg"
        style={{ backgroundColor: "#374151" }} // Page color
      >
        {/* Report Title */}
        <h2 className="text-xl text-white font-semibold mb-4">
          E-commerce Report
        </h2>

        {/* Transactions Over Time Chart */}
        <div
          id="transaction-graph"
          className="col-span-1 md:col-span-2 lg:col-span-4 p-6 bg-white text-black rounded-lg shadow-lg border-2 border-gray-900 mb-4"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-gray-700">
            Transactions Over Time
          </h3>
          <div className="w-full h-full">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={dashboardData.monthlySales.map((value, index) => ({
                  month: `M${index + 1}`,
                  value,
                }))}
              >
                <CartesianGrid strokeDasharray="5 5" stroke="#ddd" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <RechartsTooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="url(#lineGradient)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <defs>
                  <linearGradient
                    id="lineGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#909090" />
                    <stop offset="100%" stopColor="#1e3a8a" />
                  </linearGradient>
                </defs>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales Overview */}
        <div className="bg-white text-gray-700 p-6 rounded-lg shadow-lg mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Sales Overview
          </h3>
          <p>Total Sales: $ {dashboardData.sales.toFixed(2)}</p>
          <p>Number of Orders: {dashboardData.totalOrders}</p>
          <p>
            Average Order Value: ${" "}
            {(dashboardData.sales / dashboardData.totalOrders).toFixed(2)}
          </p>
          <p>
            Sales Growth:{" "}
            {(
              ((dashboardData.monthlySales[11] -
                dashboardData.monthlySales[10]) /
                dashboardData.monthlySales[10]) *
              100
            ).toFixed(2)}
            %
          </p>
        </div>

        {/* Order Summary
        <div className="bg-white text-gray-700 p-6 rounded-lg shadow-lg mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Order Summary
          </h3>
          <p>Orders Completed: {reportsData.ordersCompleted}</p>
          <p>Orders Pending: {reportsData.ordersPending}</p>
          <p>Top Selling Product: {reportsData.topSellingProduct}</p>
        </div> */}

        {/* Customer Insights */}
        <div className="bg-white text-gray-700 p-6 rounded-lg shadow-lg mb-4">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Customer Insights
          </h3>
          <p>Customers this month: {dashboardData.users}</p>
          <p>Repeat Customer Rate: {reportsData.repeatCustomerRate}%</p>
          <p>Customer Demographics: {reportsData.customerDemographics}</p>
        </div>

        {/* Export Button */}
        <div className="mt-4">
          <button
            id="export-btn"
            onClick={exportToPDF}
            // onClick={fetchCategories}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-400"
          >
            Export to PDF
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex p-8 bg-gray-900 min-h-screen w-full">
      {/* Sidebar */}
      <div className="w-1/5 p-4 bg-gray-800 text-white rounded-lg flex flex-col  h-screen">
        <div className="flex-grow">
          <div className="flex items-center mb-6">
            <img
              src="https://i.ibb.co/FbBJxxBy/ONLINE-SHOPPING-1.png"
              alt="Admin Icon"
              className="w-14 h-14 mr-3"
            />
            <h2 className="text-2xl font-semibold">Admin Panel</h2>
          </div>

          <ul className="space-y-4">
            {[
              "dashboard",
              "products",
              // "categories",
              "orders",
              "transactions",
              "users",
              "reports",
            ].map((tab) => (
              <li key={tab}>
                <button
                  className={`w-full text-left p-3 rounded-md text-sm ${
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

        {/* External Links */}
        <div className="mt-auto border-t border-gray-700 pt-4">
          <ul className="space-y-2">
            <li>
              <a
                href="https://app.drift.com/conversations"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-3 rounded-md text-sm hover:bg-gray-700 gap-2"
              >
                <img
                  src="https://is2-ssl.mzstatic.com/image/thumb/Purple124/v4/95/16/22/9516221c-f6eb-e032-e495-8996a96ca6eb/source/512x512bb.jpg?w=200"
                  alt="Drift Logo"
                  className="w-5 h-5 rounded-full"
                />
                Visit Drift.com
              </a>
            </li>

            <li>
              <a
                href={HOME_URL}
                className="block p-3 rounded-md text-sm hover:bg-gray-700 mb-10"
              >
                Back to Gigamart
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 ml-6 bg-gray-900 text-white rounded-lg">
        {/* Show "Add Product" button if the "products" tab is active */}
        {activeTab === "products" && (
          <div className="flex items-center mb-6 w-full gap-4">
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                placeholder="Search by slug..."
                value={searchSlug}
                onChange={(e) => setSearchSlug(e.target.value)}
                className="px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 focus:outline-none focus:border-gray-500 flex-1 text-sm"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-500 text-sm"
              >
                Search
              </button>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 text-white bg-gray-600 rounded hover:bg-gray-400 ml-auto text-sm"
            >
              Add Product
            </button>
          </div>
        )}

        {activeTab === "products" && renderTable(products, "products")}
        {activeTab === "categories" && renderTable(categories, "categories")}
        {activeTab === "orders" && renderTable(orders, "orders")}
        {activeTab === "users" && renderTable(users, "users")}
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
      <ErrorModal
        isOpen={isErrorModalOpen}
        onClose={() => setIsErrorModalOpen(false)}
      />
    </div>
  );
};

export default AdminPanel;
