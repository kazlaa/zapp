import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../hooks/AppContext";
import { IProduct } from "../types/product";
import "../styles/ProductsList.css";
import { ToastContainer } from "react-toastify";

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

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handleNewProductClick = () => {
    navigate("/product/add");
  };

  return (
    <div className="products-list-container">
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <h2>Products List</h2>
      <button className="new-product-btn" onClick={handleNewProductClick}>
        New Product
      </button>
      <table className="products-table">
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
                <button
                  className="edit-btn"
                  onClick={() => handleEditClick(product)}
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteClick(product)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination-container">
        <button className="pagination-btn" onClick={handleFirstPage}>
          First
        </button>
        <button className="pagination-btn" onClick={handlePreviousPage}>
          Previous
        </button>
        {Array.from(
          { length: Math.min(totalPages, 5) },
          (_, index) => index + 1
        ).map((page) => (
          <button
            key={page}
            className={`pagination-btn ${currentPage === page ? "active" : ""}`}
            onClick={() => handlePaginationClick(page)}
          >
            {page}
          </button>
        ))}
        <button className="pagination-btn" onClick={handleNextPage}>
          Next
        </button>
        <button className="pagination-btn" onClick={handleLastPage}>
          Last
        </button>
      </div>
    </div>
  );
};
