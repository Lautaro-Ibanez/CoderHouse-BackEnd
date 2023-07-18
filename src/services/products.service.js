export default class ProductsService {
  constructor(dao) {
    this.dao = dao;
  }

  getAllProducts = () => {
    return this.dao.getProducts();
  };

  addProduct = () => {
    return this.dao.saveProduct();
  };

  getProductBy = (params) => {
    return this.dao.getProductBy(params);
  };

  updateProduct = (id, Product) => {
    return this.dao.updateProduct(id, Product);
  };

  deleteProduct = (id) => {
    return this.dao.deleteProduct(id);
  };

  getProductsWithPaginate = (filters, options) => {
    return this.dao.getProductsWithPaginate(filters, options);
  };
}
