import { Router } from "express";
import cartModel from "../dao/mongo/models/cart-model.js";
import productModel from "../dao/mongo/models/product-model.js";
import { privacy } from "../middlewares/auth.js";
import { passportCall } from "../services/auth.js";
import userModel from "../dao/mongo/models/users.js";

const router = Router();

router.get("/chat", async (req, res) => {
  res.render("chat", { productList });
});

router.get(
  "/products",
  passportCall("jwt", { strategyType: "jwt" }),
  privacy("PRIVATE"),
  async (req, res) => {
    const { page = 1 } = req.query;
    const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest } =
      await productModel.paginate({}, { page, limit: 3, lean: true });
    const products = docs;
    res.render("products", {
      css: "products",
      products,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      page: rest.page,
      user: req.user,
    });
  }
);

router.get(
  "/carts/:cid",
  passportCall("jwt", { strategyType: "jwt" }),
  async (req, res) => {
    const { cid } = req.params;
    const result = await cartModel
      .findById({ _id: cid })
      .populate("products.productId")
      .lean();
    res.render("carts", { cart: result, css: "cart" });
  }
);

router.get(
  "/register",
  passportCall("jwt", { strategyType: "jwt" }),
  privacy("NO_AUTHENTICATED"),
  (req, res) => {
    res.render("register", { css: "register" });
  }
);

router.get(
  "/login",
  passportCall("jwt", { strategyType: "jwt" }),
  privacy("NO_AUTHENTICATED"),
  async (req, res) => {
    res.render("login", { css: "register" });
  }
);

router.get("/restorepassword", (req, res) => {
  res.render("restorepassword");
});

export default router;
