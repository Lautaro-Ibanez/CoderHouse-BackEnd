import { cartService, productService } from "../services/index.js";

const renderChat = async (req, res) => {
    res.render("chat", { productList });
  }

const renderProducts = async (req, res) => {
    const { page = 1 } = req.query;
    const { docs, hasPrevPage, hasNextPage, prevPage, nextPage, ...rest } =
      await productService.getProductsWithPaginate({}, { page, limit: 3, lean: true });
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

  const renderCartById = async (req, res) => {
    const { cid } = req.params;
    const result = await cartService.getCartBy({ _id: cid })
    res.render("carts", { cart: result, css: "cart" });
  }

  const renderRegister = (req, res) => {
    res.render("register", { css: "register" });
  }

  const renderLogin = (req, res) => {
    res.render("login", { css: "register" });
  }

  const renderRestorePassword = (req, res) => {
    res.render("restorepassword");
  }

  export default {
    renderChat,
    renderProducts,
    renderCartById,
    renderRegister,
    renderLogin,
    renderRestorePassword
  }