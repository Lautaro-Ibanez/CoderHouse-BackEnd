import mongoose from "mongoose";
import userModel from "../models/users.js";

export default class UserManager {
  getUsers = () => {
    return userModel.find().lean();
  };

  getUserBy = (params) => {
    return userModel.findOne(params).lean();
  };

  addUser = (User) => {
    return userModel.create(User);
  };

  updateUser = (id, User) => {
    return userModel.findByIdAndUpdate(new mongoose.Types.ObjectId(id), {
      $set: User,
    });
  };

  deleteUser = (id) => {
    return userModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));
  };
}
