import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from "../hooks/AppContext";
import "../styles/Product.css";
import { ToastContainer } from 'react-toastify';

export const Product = () => {
  const { productApi } = useAppContext();
  const params = useParams();
  const { selectedProduct, setSelectedProduct, saveSelectedProduct, fetchProductBySku, addProduct } = productApi;

  const editMode: boolean = params.sku !== 'add'; 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!selectedProduct) {
      return;
    }
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  const handleSaveClick = () => {
    editMode? saveSelectedProduct(): addProduct();
  };

  useEffect(() => {
    const fetch = async (sku: string) => {
      await fetchProductBySku(sku);
    }

    if(editMode) {
      !selectedProduct && params.sku && fetch(params.sku);
    } else {
      setSelectedProduct({ sku: '', description: '', store: '', quantity: 0})
    }
  }, [params.sku])

  return (
    <>
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
      {selectedProduct ? (
        <div className="product-container">
          <h3>Product</h3>
          <div className="form-container">
            <label>
              SKU:
              <input
                type="text"
                name="sku"
                value={selectedProduct?.sku}
                onChange={handleInputChange}
                readOnly={editMode}
              />
            </label>
            <br />
            <label>
              Description:
              <input
                type="text"
                name="description"
                value={selectedProduct?.description}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Quantity:
              <input
                type="number"
                name="quantity"
                value={selectedProduct?.quantity.toString()}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label>
              Store:
              <input
                type="text"
                name="store"
                value={selectedProduct?.store}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <button className="save-btn" onClick={handleSaveClick}>
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="product-container"></div>
      )}
    </>
  );
};
