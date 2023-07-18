import UserManager from "../dao/mongo/mongoManagers/users-mongo.js";
import CartManager from "../dao/mongo/mongoManagers/cart-mongo.js";
import ProductMaganer from "../dao/mongo/mongoManagers/product-mongo.js";

import UsersService from "./users.service.js";
import CartsService from "./carts.service.js";
import ProductsService from "./products.service.js";

export const userService = new UsersService(new UserManager());
export const cartService = new CartsService(new CartManager());
export const productService = new ProductsService(new ProductMaganer());
