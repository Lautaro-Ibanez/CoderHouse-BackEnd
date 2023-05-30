import cartModel from "../models/cart-model.js";

export default class CartManager {
  getCarts = () => {
    return cartModel.find();
  };

  getCartsBy = (params) => {
    return cartModel.findOne(params).populate('products.productId');
  };

  addCart = (cart) => {
    return cartModel.create(cart);
  };

  deleteProductFromCart = (cid, pid) => {
    return cartModel.findOneAndUpdate(
      { _id: cid },
      { $pull: { products: { productId: pid } } },
      { new: true }
    );
  };

  cartUpdate = (cid, object) => {
    return cartModel.findOneAndUpdate(
      { _id: cid },
      { $set: { products: object } },
      { new: true }
    );
  };
}
