import { useState } from "react";
import { IProduct, IProductApi } from "../types/product";
import { config } from "../config";

export const useProductApi = (): IProductApi => {
  const [isLoadingProduct, setIsLoadingProduct] = useState<boolean>(false);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [productCount, setProductCount] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);

  const PRODUCTS_PER_PAGE = 5;
  const { API_URL } = config;

  const fetchProducts = async (pageNumber: number) => {
    try {
      setIsLoadingProduct((prev) => !prev);
      const response = await fetch(
        `${API_URL}/products/?offset=${
          (pageNumber - 1) * 5
        }&limit=${PRODUCTS_PER_PAGE}`
      );
      const data = await response.json();
      console.log(JSON.stringify(data));
      setProducts(data.products);
      setProductCount(data.count);
      setTotalPages(Math.ceil(data.count / PRODUCTS_PER_PAGE));
      setIsLoadingProduct((prev) => !prev);
    } catch (error) {
      console.error("Error fetching products:", error);
      setIsLoadingProduct((prev) => !prev);
    }
  };

  const fetchProductBySku = async (sku: string) => {
    try {
      const response = await fetch(`${API_URL}/product/${sku}`);
      const data = await response.json();
      setSelectedProduct(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const updateLocalProducts = (product: IProduct) => {
    setProducts((prev) => {
      return prev.map((p) => {
        if (p.sku === product.sku) {
          return { ...product };
        }
        return { ...p };
      });
    });
  };

  const saveSelectedProduct = async () => {
    try {
      if(!selectedProduct?.sku) throw new Error('Nothing to save')
      await fetch(`${API_URL}/product/${selectedProduct?.sku}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedProduct),
      });
      updateLocalProducts(selectedProduct)
    } catch {
      console.log("Update failed");
    }
  };

  const addProduct = async () => {
    try {
      if(!selectedProduct?.sku) throw new Error('Nothing to save')
      await fetch(`${API_URL}/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedProduct),
      });

    } catch {
      console.log("Update failed");
    }
  };

  const deleteProduct = async (sku: string) => {
    try {
      await fetch(`${API_URL}/product/${sku}`, {
        method: "DELETE",
      });

      setProducts((prev) => prev.filter((p) => p.sku !== sku));
      setProductCount((prev) => prev - 1);
      setTotalPages(Math.ceil(productCount / PRODUCTS_PER_PAGE));
    } catch {
      console.log("delete failed");
    }
  };

  return {
    isLoadingProduct,
    products,
    productCount,
    totalPages,
    selectedProduct,
    setSelectedProduct,
    fetchProducts,
    fetchProductBySku,
    saveSelectedProduct,
    deleteProduct,
    addProduct,
  };
};
