import React, { useEffect, useMemo, useState } from "react";
import FilterIcon from "../../components/common/FilterIcon";
import PriceFilter from "../../components/Filters/PriceFilter";
import ProductCard from "./ProductCard";
import { getAllProducts } from "../../api/fetchProducts";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../store/features/common";
import DriftWidget from "../../components/DriftWidget";
import Categories from "../../components/Filters/Categories";
import Footer from "../../components/Footer/Footer";
import content from "../../data/content.json";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage > 3) pages.push(1, "...");
      for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...", totalPages);
    }
    return pages;
  };

  return (
    <div className="flex justify-center mt-10">
      {/* Previous Button */}
      <button
        className="px-3 py-2 border rounded hover:bg-gray-300 disabled:opacity-50"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-3 py-2">...</span>
        ) : (
          <button
            key={page}
            className={`px-3 py-2 border rounded ${
              currentPage === page ? "bg-black text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        className="px-3 py-2 border rounded hover:bg-gray-300 disabled:opacity-50"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    </div>
  );
};

const ProductListPage = ({ categoryType }) => {
  const categoryData = useSelector((state) => state?.categoryState?.categories);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 10, max: 10000 });
  const [selectedCategoryTypes, setSelectedCategoryTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Get category details from Redux store (for description, etc.)
  const category = useMemo(() => {
    return categoryData?.find((element) => element?.code === categoryType);
  }, [categoryData, categoryType]);

  // Fetch products for the given category
  useEffect(() => {
    if (!category?.id) return;
    dispatch(setLoading(true));
    getAllProducts(category.id)
      .then((res) => {
        setProducts(res);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [category?.id, dispatch]);

  // Compute unique category types from the loaded products
  const productCategoryTypes = useMemo(() => {
    const typesSet = new Set();
    products.forEach((product) => {
      if (product?.categoryTypeName) {
        typesSet.add(product.categoryTypeName);
      }
    });
    return Array.from(typesSet).map((type) => ({ code: type, name: type }));
  }, [products]);

  // Filter products by price range and selected category types
  const filteredProducts = useMemo(() => {
    return products?.filter((product) => {
      const isWithinPriceRange =
        product?.price >= priceRange.min && product?.price <= priceRange.max;
      const isMatchingCategory =
        selectedCategoryTypes.length === 0 ||
        selectedCategoryTypes.includes(product?.categoryTypeName);
      return isWithinPriceRange && isMatchingCategory;
    });
  }, [products, priceRange, selectedCategoryTypes]);

  // Calculate pagination
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <div className="relative">
      <div className="flex">
        <div className="w-[20%] h-[400px] p-[20px] border rounded-lg m-[20px]">
          {/* Filters */}
          <div className="flex justify-between">
            <p className="text-[16px] text-gray-600">Filter</p>
            <FilterIcon />
          </div>
          <div>
            <p className="text-[16px] text-black mt-5">Categories</p>
            <Categories
              types={productCategoryTypes}
              selectedTypes={selectedCategoryTypes}
              setSelectedTypes={setSelectedCategoryTypes}
            />
            <hr />
          </div>
          {/* Price Filter */}
          <PriceFilter range={priceRange} setRange={setPriceRange} />
        </div>

        <div className="p-[15px]">
          <p className="text-black text-lg">{category?.description}</p>

          {/* Product Grid */}
          <div className="pt-4 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8 px-2">
            {paginatedProducts.map((item, index) => (
              <ProductCard key={`${item?.id}_${index}`} {...item} title={item?.name} />
            ))}
          </div>

          {/* Pagination Component */}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

      {/* DriftWidget */}
      <DriftWidget />
      <Footer content={content?.footer} />
    </div>
  );
};

export default ProductListPage;
