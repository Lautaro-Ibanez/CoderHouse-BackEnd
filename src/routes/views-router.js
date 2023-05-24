import { Router } from "express";
import ProductManager from "../dao/mongo/mongoManagers/product-mongo.js";
const router = Router();
const products = new ProductManager();

router.get("/", async (req, res) => {
  const productList = await products.getProducts();
  res.render("chat",{productList});
});

export default router;
