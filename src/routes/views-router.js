import viewsController from "../controllers/views.controller.js";
import { passportCall, privacy } from "../services/auth.js";
import BaseRouter from "./router.js";

export default class ViewsRouter extends BaseRouter {
  init() {
    this.get("/chat", ["PUBLIC"], viewsController.renderChat);

    this.get(
      "/products",
      ["PUBLIC"],
      passportCall("jwt", { strategyType: "jwt" }),
      privacy("PRIVATE"),
      viewsController.renderProducts
    );

    this.get(
      "/carts/:cid",
      [""],
      passportCall("jwt", { strategyType: "jwt" }),
      viewsController.renderCartById
    );

    this.get(
      "/register",
      ["NO_AUTH"],
      passportCall("jwt", { strategyType: "jwt" }),
      privacy("NO_AUTHENTICATED"),
      viewsController.renderRegister
    );

    this.get(
      "/login",
      ["NO_AUTH"],
      passportCall("jwt", { strategyType: "jwt" }),
      privacy("NO_AUTHENTICATED"),
      viewsController.renderLogin
    );

    this.get(
      "/restoreRequest",
      ["PUBLIC"],
      viewsController.renderRestoreRequest
    );

    this.get(
      "/restorePassword",
      ["NO_AUTH"],
      viewsController.renderRestorePassword
    );
  }
}
