import mongoose from "mongoose";

const collection = "users";

const schema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: {
      type: String,
      default: "user",
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carts",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model(collection, schema);

export default userModel;
