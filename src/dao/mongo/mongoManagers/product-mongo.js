import mongoose from "mongoose";
import productModel from "../models/product-model.js";

export default class ProductManager {
  getProducts = () => {
    return productModel.find().lean();
  };

  getProductBy = (params) => {
    return productModel.findOne(params).lean();
  };

  addProduct = (product) => {
    return productModel.create(product);
  };

  updateProduct = (id, product) => {
    return productModel.findByIdAndUpdate(new mongoose.Types.ObjectId(id), { $set: product });
  };

  deleteProduct = (id) => {
    return productModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));
  };
}
