import cartModel from "../models/cart-model.js";

export default class CartManager {
  getCarts = () => {
    return cartModel.find();
  };

  getCartsBy = (params) => {
    return cartModel.findOne(params);
  };

  addCart = (cart) => {
    return cartModel.create(cart);
  };

}
