import mongoose, { Schema } from 'mongoose';
import { IProduct } from '../../interfaces';

export const ProductSchema = new Schema<IProduct>(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      unique: true,
    },
    store: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true }
);

export const getProductModel = () => (mongoose.models['product'] || 
  mongoose.model<IProduct>('product', ProductSchema)) as mongoose.Model<IProduct>;