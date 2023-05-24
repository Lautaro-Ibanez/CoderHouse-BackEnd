import mongoose from "mongoose";

const collection = "products";

const schema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    description: String,
    thumbnail: String,
    code: String,
    stock: Number,
    status: {
      type: Boolean,
      default: true,
    },
    category: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "update_at" } }
);

const productModel = mongoose.model(collection, schema);

export default productModel;
