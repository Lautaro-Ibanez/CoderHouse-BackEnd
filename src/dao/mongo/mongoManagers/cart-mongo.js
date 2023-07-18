import cartModel from "../models/cart-model.js";

export default class CartManager {
  getCarts = () => {
    return cartModel.find();
  };

  getCartBy = (params) => {
    return cartModel.findOne(params).populate("products.productId").lean();
  };

  saveCart = (cart) => {
    return cartModel.create(cart);
  };

  deleteCart = (cid) => {
    return cartModel.findByIdAndDelete(cid);
  };

  deleteProductFromCart = (cid, pid) => {
    return cartModel.findOneAndUpdate(
      { _id: cid },
      { $pull: { products: { productId: pid } } },
      { new: true }
    );
  };

  updateCart = (cid, array) => {
    return cartModel.findOneAndUpdate(
      { _id: cid },
      { $set: { products: array} },
      { new: true }
    );
  };

  addProductToCart = (cid, pid) => {
    return cartModel.findOneAndUpdate(
      { _id: cid, "products.productId": { $ne: pid } },
      { $addToSet: { products: { productId: pid, quantity: 1 } } },
      { new: true }
    );
  };

  incrementProduct = (cid, pid) => {
    return cartModel.findOneAndUpdate(
      { _id: cid, "products.productId": pid },
      { $inc: { "products.$.quantity": 1 } },
      { new: true }
    );
  };

  updateProductInCart = (cid, pid, quantity) => {
    return cartModel.findOneAndUpdate(
      { _id: cid, "products.productId": pid },
      { $set: { "products.$.quantity": quantity } },
      { new: true }
    );
  };
}
