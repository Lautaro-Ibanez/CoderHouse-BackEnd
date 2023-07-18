export default class CartsService {
  constructor(dao) {
    this.dao = dao;
  }

  getAllCarts = () => {
    return this.dao.getCarts();
  };

  addCart = () => {
    return this.dao.saveCart();
  };

  getCartBy = (params) => {
    return this.dao.getCartBy(params);
  };

  updateCart = (cid, products) => {
    return this.dao.updateCart(cid, products);
  };

  deleteCart = (cid) => {
    return this.dao.deleteCart(cid);
  };

  deleteProductFromCart = (cid, pid) => {
    return this.dao.deleteProductFromCart(cid, pid);
  };

  addProductToCart = (cid, pid) => {
    return this.dao.addProductToCart(cid, pid);
  };

  incrementProduct = (cid, pid) => {
    return this.dao.incrementProduct(cid, pid);
  };

  updateProductInCart = (cid, pid, quantity) => {
    return this.dao.updateProductInCart(cid, pid, quantity);
  };
}
