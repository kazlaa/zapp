import { ProjectionType } from "mongoose";
import { IProduct } from "src/interfaces";

export interface IPaginatedProducts {
  products: IProduct[];
  count: number;
};

export interface IProductRepository {
  create(product: IProduct): Promise<IProduct>;
  update(
    query: { [Key in keyof IProduct]?: any },
    product: IProduct
  ): Promise<boolean>;
  delete(query: { [Key in keyof IProduct]?: any }): Promise<boolean>;
  list(
    offset: number,
    limit: number,
    query?: { [Key in keyof IProduct]?: any },
    projection?: ProjectionType<IProduct>
  ): Promise<IPaginatedProducts>;
  get(query: { [Key in keyof IProduct]?: any }): Promise<IProduct>;
}
