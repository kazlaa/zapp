import { Model, ProjectionType } from "mongoose";
import { getProductModel } from "./models/ProductModel";
import { IPaginatedProducts, IProductRepository } from "./IProductRepository";
import { IProduct } from "src/interfaces";

class ProductRepository implements IProductRepository {
  private defaultProjection = {
    _id: 0,
    sku: 1,
    description: 1,
    quantity: 1,
    store: 1,
  };
  constructor(private readonly productModel: Model<IProduct>) {}

  create(entity: IProduct): Promise<IProduct> {
    return this.productModel.create(entity);
  }

  async update(
    query: { [Key in keyof IProduct]?: any },
    entity: IProduct
  ): Promise<boolean> {
    const result = await this.productModel.updateOne(query, entity).lean();
    return result.modifiedCount > 0 || result.upsertedCount > 0;
  }

  async delete(query: { [Key in keyof IProduct]?: any }): Promise<boolean> {
    const result = await this.productModel.deleteMany(query).lean();
    return result.deletedCount > 0;
  }

  async list(
    offset: number,
    limit: number,
    query?: { [Key in keyof IProduct]?: any },
    projection?: ProjectionType<IProduct>
  ): Promise<IPaginatedProducts> {
    const products = await this.productModel
      .find(query || {}, projection || this.defaultProjection)
      .skip(offset)
      .limit(limit)
      .lean();
    const count = await this.productModel.countDocuments();
    return { products, count };
  }

  async get(query: { [Key in keyof IProduct]?: any }): Promise<IProduct> {
    const product = await this.productModel
      .findOne(query, this.defaultProjection)
      .lean();
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }
}

export const productRepository = new ProductRepository(getProductModel());
