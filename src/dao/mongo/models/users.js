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
  },
  { timestamps: true }
);

const userModel = mongoose.model(collection, schema);

export default userModel;
