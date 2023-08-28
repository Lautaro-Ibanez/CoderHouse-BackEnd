import BaseRouter from "./router.js";
import usersController from "../controllers/users.controller.js";

export default class UsersRouter extends BaseRouter {
  init() {
    this.get("/premiun/:uid", ["PUBLIC"], usersController.createUserPremiun);
  }
}
