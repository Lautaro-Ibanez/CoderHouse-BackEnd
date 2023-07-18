import mongoose from "mongoose";
import productModel from "../models/product-model.js";

export default class ProductManager {
  getProducts = () => {
    return productModel.find().lean();
  };

  getProductsWithPaginate = (filters, options) => {
    return productModel.paginate(filters, options);
  };

  getProductBy = (params) => {
    return productModel.findOne(params).lean();
  };

  saveProduct = (product) => {
    return productModel.create(product);
  };

  updateProduct = (id, product) => {
    return productModel.findByIdAndUpdate(new mongoose.Types.ObjectId(id), {
      $set: product,
    });
  };

  deleteProduct = (id) => {
    return productModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));
  };
}
