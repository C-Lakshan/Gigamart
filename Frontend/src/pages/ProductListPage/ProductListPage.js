import React, { useEffect, useMemo, useState } from 'react';
import FilterIcon from '../../components/common/FilterIcon';
import PriceFilter from '../../components/Filters/PriceFilter';
import ProductCard from './ProductCard';
import { getAllProducts } from '../../api/fetchProducts';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../../store/features/common';
import DriftWidget from '../../components/DriftWidget';
import Categories from '../../components/Filters/Categories';

const ProductListPage = ({ categoryType }) => {
  const categoryData = useSelector((state) => state?.categoryState?.categories);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 10, max: 10000 });
  const [selectedCategoryTypes, setSelectedCategoryTypes] = useState([]);

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
        console.error('Error fetching products:', err);
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
    // Map to objects with code and name (customize if needed)
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

  return (
    <div className="relative">
      <div className="flex">
        <div className="w-[20%] p-[20px] border rounded-lg m-[20px]">
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
          {/* Products */}
          <div className="pt-4 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8 px-2">
            {filteredProducts?.map((item, index) => (
              <ProductCard
                key={`${item?.id}_${index}`}
                {...item}
                title={item?.name}
              />
            ))}
          </div>
        </div>
      </div>
      {/* DriftWidget */}
      <DriftWidget />
    </div>
  );
};

export default ProductListPage;
