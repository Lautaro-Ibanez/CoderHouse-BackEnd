import mongoose from "mongoose";

const collection = "carts";

const schema = new mongoose.Schema(
  {
    products: [
      {
        _id:false,
        id: String,
        quantity: Number
      },
    ],
  },
  {autoCreate:false},
  { timestamps: { createdAt: "created_at", updatedAt: "update_at" } }
);

const cartModel = mongoose.model(collection, schema);

export default cartModel;
