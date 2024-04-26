import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../hooks/AppContext";
import { IProduct } from "../types/product";

export const ProductsList: React.FC = () => {
  const { productApi } = useAppContext();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();

  const {
    products,
    productCount,
    totalPages,
    fetchProducts,
    setSelectedProduct,
    deleteProduct,
  } = productApi;

  useEffect(() => {
    const fetch = async () => await fetchProducts(currentPage);
    fetch();
  }, [currentPage, productCount]);

  const handlePaginationClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditClick = (product: IProduct) => {
    setSelectedProduct(product);
    navigate(`/product/${product.sku}`);
  };

  const handleDeleteClick = (product: IProduct) => {
    deleteProduct(product.sku);
  };

  return (
    <div>
      <h2>Products List</h2>
      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Description</th>
            <th>Quantity</th>
            <th>Store</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>{product.sku}</td>
              <td>{product.description}</td>
              <td>{product.quantity}</td>
              <td>{product.store}</td>
              <td>
                <button onClick={() => handleEditClick(product)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDeleteClick(product)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(
          (page) => (
            <button key={page} onClick={() => handlePaginationClick(page)}>
              {page}
            </button>
          )
        )}
      </div>
    </div>
  );
};
