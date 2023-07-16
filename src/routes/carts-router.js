import { Router } from "express";
import CartManager from "../dao/mongo/mongoManagers/cart-mongo.js";
import cartModel from "../dao/mongo/models/cart-model.js";
import productModel from "../dao/mongo/models/product-model.js";
import mongoose from "mongoose";

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

router.get("/:cid/cantItems", async (req, res) => {
  try {
    const cart = await cartModel.findById(req.params.cid);
    const productsInCart = (cart) => {
      let cantidad = 0;
      for (let i = 0; i < cart.products.length; i++) {
        cantidad += cart.products[i].quantity;
      }
      return cantidad;
    };
    const quantityCartItems = productsInCart(cart);
    res.status(200).send(quantityCartItems.toString());
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;

    /*-------------------- Me fijo si existe carrito ? --------------------*/
    const cartResult = await carts.getCartsBy({ _id: cid });
    if (!cartResult) {
      return res.status(404).send({ error: "cart not found" });
    }

    /*-------------------- Me fijo si existe producto ? --------------------*/
    const productResult = await productModel.findById({ _id: pid });
    if (!productResult) {
      return res.status(404).send({ error: "product not found" });
    }

    /*--------------------  primera consulta : agregar el producto si no existe  -------------------- */
    const cartUpdated = await cartModel.findOneAndUpdate(
      { _id: cid, "products.productId": { $ne: pid } },
      { $addToSet: { products: { productId: pid, quantity: 1 } } },
      { new: true }
    );

    if (cartUpdated) {
      return res.send({ status: "Succes", message: "Product Added To Cart" });
    }

    /*--------------------  segunda consulta : incrementar quantity en 1 si ya existe el producto  -------------------- */
    const cartUpdated2 = await cartModel.findOneAndUpdate(
      { _id: cid, "products.productId": pid },
      { $inc: { "products.$.quantity": 1 } },
      { new: true }
    );

    if (cartUpdated2) {
      return res.send({ status: "Succes", message: "Product increment one" });
    }

    res.status(500).send({ error: "could not update cart" });
  } catch (err) {
    console.log("Error al manejar la solicitud:", err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  try {
    await cartModel.findOneAndUpdate(
      { _id: cid },
      { $pull: { products: { productId: pid } } },
      { new: true }
    );
    res.send({ status: "succes", message: "Product Deleted" });
  } catch {
    res.status(404).send({ status: "error", error: "error deleting product" });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const object = req.body;
    const productsWithObjectId = object.products.map((product) => ({
      productId: new mongoose.Types.ObjectId(product.productId),
      quantity: product.quantity,
    }));
    const result = await carts.cartUpdate(cid, productsWithObjectId);
    if (result) {
      return res
        .status(200)
        .send({ status: "succes", message: "Cart Updated" });
    }
  } catch (err) {

    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.put("/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cantidad = req.body;
    if (cantidad.quantity < 0) {
      return res.status(400).send({ error: "incorrect values" });
    }

    /*-------------------- Me fijo si existe carrito ? --------------------*/
    const cartResult = await carts.getCartsBy({ _id: cid });
    if (!cartResult) {
      return res.status(404).send({ error: "cart not found" });
    }

    /*-------------------- Me fijo si existe producto ? --------------------*/
    const productResult = await productModel.findById({ _id: pid });
    if (!productResult) {
      return res.status(404).send({ error: "product not found" });
    }

    const result = await cartModel.findOneAndUpdate(
      { _id: cid, "products.productId": pid },
      { $set: { "products.$.quantity": cantidad.quantity } },
      { new: true }
    );
    if (result) {
      return res
        .status(200)
        .send({ status: "succes", message: "Product Quantity Updated" });
    }
  } catch {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    /*-------------------- Me fijo si existe carrito ? --------------------*/
    const cartResult = await carts.getCartsBy({ _id: cid });
    if (!cartResult) {
      return res.status(404).send({ error: "cart not found" });
    }

    const deleteProducts = await cartModel.findOneAndUpdate(
      { _id: cid },
      { $unset: { products: 1 } }
    );

    if (deleteProducts) {
      return res.status(200).send({
        status: "succes",
        message: "the products in the cart have been removed",
      });
    }
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
});

export default router;
