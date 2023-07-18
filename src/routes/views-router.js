import { Router } from "express";

import viewsController from "../controllers/views.controller.js";

import { passportCall, privacy } from "../services/auth.js";

const router = Router();

router.get("/chat", viewsController.renderChat);

router.get("/products",passportCall("jwt", { strategyType: "jwt" }),  privacy("PRIVATE"), viewsController.renderProducts);

router.get("/carts/:cid", passportCall("jwt", { strategyType: "jwt" }), viewsController.renderCartById);

router.get("/register", passportCall("jwt", { strategyType: "jwt" }), privacy("NO_AUTHENTICATED"),  viewsController.renderRegister);

router.get("/login",passportCall("jwt", { strategyType: "jwt" }), privacy("NO_AUTHENTICATED"),  viewsController.renderLogin);

router.get("/restorepassword", viewsController.renderRestorePassword);

export default router;
