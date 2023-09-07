import cartsController from "../controllers/carts.controller.js";
import BaseRouter from "./router.js";

export default class CartRouter extends BaseRouter {
    init() {
  
        this.get("/",['ADMIN'], cartsController.getCarts);

        this.post("/",['ADMIN','USER','PREMIUM'], cartsController.addCart);
        
        this.get("/:cid",['ADMIN','USER','PREMIUM'], cartsController.getCartById);
        
        this.get("/:cid/cantItems",['ADMIN','USER','PREMIUM'], cartsController.getQuantityItems);
        
        this.post("/:cid/product/:pid",['ADMIN','USER','PREMIUM'], cartsController.addProductToCart);
        
        this.delete("/:cid/product/:pid",['ADMIN','USER','PREMIUM'], cartsController.deleteProduct);
        
        this.put("/:cid",['ADMIN','USER','PREMIUM'], cartsController.cartUpdateWithBody);
        
        this.put("/:cid/product/:pid",['ADMIN','USER','PREMIUM'], cartsController.productInCartUpdate);
        
        this.delete("/:cid",['ADMIN','USER','PREMIUM'], cartsController.deleteCart);
        
        this.get("/:cid/purchase",['ADMIN','USER','PREMIUM'], cartsController.purchase)
      
    }
  
  }