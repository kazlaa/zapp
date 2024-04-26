import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from "../hooks/AppContext";

export const Product = () => {
  const { productApi } = useAppContext();
  const params = useParams();
  
  const { selectedProduct, setSelectedProduct, saveSelectedProduct, fetchProductBySku } = productApi;


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (!selectedProduct) {
      return;
    }
    setSelectedProduct({ ...selectedProduct, [name]: value });
  };

  const handleSaveClick = () => {
    saveSelectedProduct();
  };

  useEffect(() => {
    const fetch = async (sku: string) => {
      await fetchProductBySku(sku);
    }

    !selectedProduct && params.sku && fetch(params.sku);
  },[params.sku])

  if(!selectedProduct) {
    return <div>
      <p>looking for your product</p>
    </div>
  }

  return (
    <div>
      <h3>Product</h3>
        <div>
          <label>
            SKU:
            <input type="text" name="sku" value={selectedProduct?.sku} onChange={handleInputChange} readOnly/>
          </label>
          <br />
          <label>
            Description:
            <input type="text" name="description" value={selectedProduct?.description} onChange={handleInputChange} />
          </label>
          <br />
          <label>
            Quantity:
            <input type="number" name="quantity" value={selectedProduct?.quantity.toString()} onChange={handleInputChange} />
          </label>
          <br />
          <label>
            Store:
            <input type="text" name="store" value={selectedProduct?.store} onChange={handleInputChange} />
          </label>
          <br />
          <button onClick={handleSaveClick}>Save</button>
        </div>

    </div>
  );
};
