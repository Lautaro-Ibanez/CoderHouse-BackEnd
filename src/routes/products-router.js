import BaseRouter from "./router.js";
import productsController from "../controllers/products.controller.js";

export default class ProductRouter extends BaseRouter {
  init() {
    this.get("/", ["PUBLIC"], productsController.getProducts);

    this.post("/", ["ADMIN", "PREMIUM"], productsController.addProduct);

    this.get("/:pid", ["PUBLIC"], productsController.getProductById);

    this.put("/:pid", ["ADMIN", "PREMIUM"], productsController.updateProduct);

    this.delete("/:pid", ["ADMIN", "PREMIUM"], productsController.deleteProduct);
  }
}
