import { Router } from "express";
import cartsController from "../controllers/carts.controller.js";

const router = Router();

router.get("/", cartsController.getCarts);

router.post("/", cartsController.addCart);

router.get("/:cid", cartsController.getCartById);

router.get("/:cid/cantItems", cartsController.getQuantityItems);

router.post("/:cid/product/:pid", cartsController.addProductToCart);

router.delete("/:cid/product/:pid", cartsController.deleteProduct);

router.put("/:cid", cartsController.cartUpdateWithBody);

router.put("/:cid/product/:pid", cartsController.productInCartUpdate);

router.delete("/:cid", cartsController.deleteCart);

export default router;
