import { passportCall } from "../services/auth.js";
import sessionController from "../controllers/session.controller.js";
import BaseRouter from "./router.js";

export default class SessionRouter extends BaseRouter {
  init() {

    this.post("/register",["NO_AUTH"],passportCall("register", { strategyType: "locals" }),sessionController.registerResponse);

    this.post("/login",["NO_AUTH"],passportCall("login", { strategyType: "locals" }),sessionController.login);

    this.get("/current", ["USER", "ADMIN"], sessionController.getCurrentUser);

    this.get("/logout", ["USER", "ADMIN"], sessionController.logout);

    this.get("/github",["NO_AUTH"],passportCall("github", { strategyType: "locals" }));

    this.get("/githubCallback",["NO_AUTH"],passportCall("github", { strategyType: "locals" }),sessionController.gitCreateUser);
    
  }

}
