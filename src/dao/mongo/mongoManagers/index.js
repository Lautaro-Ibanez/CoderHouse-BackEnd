import UserManager from "./users-mongo.js";
import CartManager from "./cart-mongo.js";
import MessageManager from "./messages-mongo.js";
import ProductManager from "./product-mongo.js";

export const usersService = new UserManager();
export const cartsService = new CartManager();
export const messagesService = new MessageManager();
export const productsService = new ProductManager();
