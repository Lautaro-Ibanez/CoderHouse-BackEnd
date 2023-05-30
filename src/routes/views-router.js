import { Router } from "express";
import cartModel from "../dao/mongo/models/cart-model.js";
import productModel from "../dao/mongo/models/product-model.js";

const router = Router();

router.get("/chat", async (req, res) => {
  res.render("chat", { productList });
});

router.get("/products", async (req, res) => {
  const { page = 1 } = req.query;
  const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest } =
    await productModel.paginate({}, { page, limit: 1, lean: true });
  const products = docs;
  res.render("products", {
    products,
    hasPrevPage,
    hasNextPage,
    prevPage,
    nextPage,
    page: rest.page,
  });
});

router.get("/cart")

export default router;
