import { IProduct } from "../interfaces";

export const validateProduct = (product: IProduct): string[] => {
  const invalidFields: string[] = [];

  if (!product.sku) {
    invalidFields.push("sku");
  }
  if (!product.description) {
    invalidFields.push("description");
  }
  if (!product.store) {
    invalidFields.push("store");
  }
  if (product.quantity === undefined) {
    invalidFields.push("quantity");
  }

  return invalidFields;
}