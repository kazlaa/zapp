export interface IProduct {
  quantity: number;
  sku: string;
  description: string;
  store: string;
}

export interface IProductApi {
  isLoadingProduct: boolean;
  products: IProduct[];
  productCount: number;
  totalPages: number;
  selectedProduct: IProduct | null;
  setSelectedProduct: (product: IProduct | null) => void;
  fetchProducts: (page: number) => void;
  fetchProductBySku: (sku: string) => void;
  saveSelectedProduct: () => void;
  deleteProduct: (sku: string) => void;
}
