import BaseRouter from "./router.js";
import productsController from "../controllers/products.controller.js";

export default class ProductRouter extends BaseRouter {
  init() {
    this.get("/", ["ADMIN", "USER"], productsController.getProducts);

    this.post("/", ["ADMIN", "USER"], productsController.addProduct);

    this.get("/:pid", ["ADMIN", "USER"], productsController.getProductById);

    this.put("/:pid", ["ADMIN", "USER"], productsController.updateProduct);

    this.delete("/:pid", ["ADMIN", "USER"], productsController.deleteProduct);
  }
}
