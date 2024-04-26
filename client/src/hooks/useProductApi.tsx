import { useState } from "react";
import { IProduct, IProductApi } from "../types/product";
import { config } from "../config";
import { toast } from "react-toastify";

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
      setIsLoadingProduct(true);
      const response = await fetch(
        `${API_URL}/products/?offset=${
          (pageNumber - 1) * 5
        }&limit=${PRODUCTS_PER_PAGE}`
      );
      const data = await response.json();

      setProducts(data.products);
      setProductCount(data.count);
      setTotalPages(Math.ceil(data.count / PRODUCTS_PER_PAGE));
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const fetchProductBySku = async (sku: string) => {
    try {
      setIsLoadingProduct(true);
      const response = await fetch(`${API_URL}/product/${sku}`);
      if (response.status !== 200) {
        const responseText = await response.text();
        throw new Error(responseText);
      }
      const data = await response.json();
      setSelectedProduct(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoadingProduct(false);
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
      if (!selectedProduct?.sku) throw new Error("sku is mandatory and mus be unique");
      toast.info('Saving product');
      setIsLoadingProduct(true);
      const response = await fetch(
        `${API_URL}/product/${selectedProduct?.sku}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedProduct),
        }
      );
      if (response.status !== 200) {
        throw new Error(await response.text());
      }
      updateLocalProducts(selectedProduct);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const addProduct = async () => {
    try {
      if (!selectedProduct?.sku) throw new Error("sku is mandatory and must be unique");
      toast.info('Saving product');
      setIsLoadingProduct(true);
      const response = await fetch(`${API_URL}/product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedProduct),
      });
      if (response.status !== 200) {
        throw new Error(await response.text());
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoadingProduct(false);
    }
  };

  const deleteProduct = async (sku: string) => {
    try {
      const response = await fetch(`${API_URL}/product/${sku}`, {
        method: "DELETE",
      });

      setProducts((prev) => prev.filter((p) => p.sku !== sku));
      setProductCount((prev) => prev - 1);
      setTotalPages(Math.ceil(productCount / PRODUCTS_PER_PAGE));

      if (response.status !== 200) {
        throw new Error(await response.text());
      }
    } catch {
      toast.error("delete failed");
    } finally {
      setIsLoadingProduct(false);
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
