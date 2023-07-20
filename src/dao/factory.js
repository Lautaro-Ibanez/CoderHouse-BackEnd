import config from "../config/config.js";
import mongoose from "mongoose";

const persistence = config.persistence;

export default class PersistenceFactory {
  static async getPersistence() {
    let userDAO;
    let cartDAO;
    let productDAO;
    switch (persistence) {
      case "MONGO":
        const connection = mongoose.connect(config.mongoURL);
        const {default: MongoUsersDB} = await import("./mongo/mongoManagers/users-mongo.js");
        const {default: MongoCartsDB} = await import("./mongo/mongoManagers/cart-mongo.js");
        const {default: MongoProductsDB} = await import("./mongo/mongoManagers/product-mongo.js");
        userDAO = new MongoUsersDB();
        cartDAO = new MongoCartsDB();
        productDAO = new MongoProductsDB();
        break;
    }
    return {userDAO,cartDAO,productDAO};
  }
}
