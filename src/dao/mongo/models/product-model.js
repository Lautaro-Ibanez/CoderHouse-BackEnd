import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";

const schema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    description: String,
    thumbnail: String,
    code: String,
    stock: Number,
    owner: {
      type: String,
      default: "admin",
    },
    status: {
      type: Boolean,
      default: true,
    },
    category: String,
  },
  { timestamps: { createdAt: "created_at", updatedAt: "update_at" } }
);

schema.plugin(mongoosePaginate);

const productModel = mongoose.model(collection, schema);

export default productModel;
