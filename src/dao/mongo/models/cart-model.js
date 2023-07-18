import mongoose from "mongoose";

const collection = "carts";

const schema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: Number,
        _id: false,
      },
    ],
  },
  { timestamps: { createdAt: "created_at", updatedAt: "update_at" } }
);

const cartModel = mongoose.model(collection, schema);

export default cartModel;
