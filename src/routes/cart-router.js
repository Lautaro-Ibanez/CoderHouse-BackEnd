import { Router } from "express";
import CartManager from "../cartManager.js";
import ProductManager from "../productManager.js";

const router = Router();

export default router;

const products = new ProductManager()
const carts = new CartManager();

router.post("/", (req, res) => {
  carts.addCart();
  res.send({ status: "succes", message: "Cart Added" });
});

router.get("/:cid", (req, res) => {
    const cid = parseInt(req.params.cid);
    carts.getCartsById(cid)
    .then((resultado)=>{
        res.send(resultado.products)
    })
});

router.post("/:cid/product/:pid", (req, res)=>{
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);
    carts.addProductToCart(cid,pid);
    res.send({status: "succes", message: "Product added to cart" })
})