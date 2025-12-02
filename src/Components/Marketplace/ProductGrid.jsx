// ProductGrid.jsx
"use client";

import React from "react";
import { useNavigate } from "react-router-dom";

const ProductGrid = ({ products }) => {
  const navigate = useNavigate();

  // Normalize: support both API response object and raw array
  const productList = products?.results || products || [];

  console.log("ProductGrid products:", productList);

  if (!productList || productList.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg shadow-md">
        <p className="text-gray-500 text-lg">
          No products available right now 🚫
        </p>
      </div>
    );
  }

  const handleClick = (id) => {
    console.log("Clicked product:", id);
    navigate(`/marketplace/${id}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {productList.map((product) => {
        const imageSrc =
          product.primary_image?.image || "/placeholder.svg";
        const categoryLabel =
          product.category_name || `Category #${product.category}`;
        const priceLabel = `${product.price} ৳`;
        const stockLabel =
          product.stock > 0
            ? `${product.stock} in stock`
            : "Out of stock";

        return (
          <div
            key={product.id}
            onClick={() => handleClick(product.id)}
            className="bg-gray-50 rounded-lg shadow-md overflow-hidden hover:scale-105 transform transition-transform duration-300 ease-out cursor-pointer"
          >
            <img
              src={imageSrc}
              alt={product.name}
              className="w-full h-48 object-cover"
            />

            <div>
              <p className="text-xs text-gray-700 mb-1 bg-[#DBEAFE] px-4 py-2 rounded-br-[100px]">
                {categoryLabel}
              </p>

              <div className="px-4 py-3">
                <p className="text-lg font-semibold text-green-600 mb-1">
                  {priceLabel}
                </p>
                <p className="text-base font-medium text-gray-900 mb-1 line-clamp-1">
                  {product.name}
                </p>
                <p className="text-sm text-gray-500">{stockLabel}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;
