import cartsController from "../controllers/carts.controller.js";
import BaseRouter from "./router.js";

export default class CartRouter extends BaseRouter {
    init() {
  
        this.get("/",['ADMIN'], cartsController.getCarts);

        this.post("/",['ADMIN','USER'], cartsController.addCart);
        
        this.get("/:cid",['ADMIN','USER'], cartsController.getCartById);
        
        this.get("/:cid/cantItems",['ADMIN','USER'], cartsController.getQuantityItems);
        
        this.post("/:cid/product/:pid",['ADMIN','USER'], cartsController.addProductToCart);
        
        this.delete("/:cid/product/:pid",['ADMIN','USER'], cartsController.deleteProduct);
        
        this.put("/:cid",['ADMIN','USER'], cartsController.cartUpdateWithBody);
        
        this.put("/:cid/product/:pid",['ADMIN','USER'], cartsController.productInCartUpdate);
        
        this.delete("/:cid",['ADMIN','USER'], cartsController.deleteCart);
        
        this.get("/:cid/purchase",['ADMIN','USER'], cartsController.purchase)
      
    }
  
  }