import { Router } from "express";
import CartManager from "../dao/mongo/mongoManagers/cart-mongo.js";

const router = Router();
const carts = new CartManager();

router.get("/", async (req, res) => {
  const result = await carts.getCarts();
  res.send({ carts: result });
});

router.post("/", async (req, res) => {
  const { products } = req.body;
  if (!products) return res.status(404).send({ error: "incomplete values" });
  const cart = { products };
  const result = await carts.addCart(cart);
  res.send({ status: "succes", message: "Cart Added" });
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await carts.getCartsBy({ _id: cid });
    res.status(200).send(result);
  } catch (err) {
    res.status(404).send({ error: "Cart Not Found" });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await carts.getCartsBy({ _id: cid });
    if (!cart) {
      return res.status(404).send({ error: "Cart Not Found" });
    }

    const existingProduct = cart.products.find((product) => product.id === pid);
    if (existingProduct) {
      existingProduct.quantity += 1;
      await cart.save();
      return res.send({ status: "succes", message: "Product Increment One" });
    } else {
      cart.products.push({ id: pid, quantity: 1 });
    }
    await cart.save();
    return res.send({ status: "succes", message: "Product Added To Cart" });
  } catch (err) {
    return res.status(500).send({ error: "Error al añadir el producto" });
  }
});

export default router;
