import PersistenceFactory from "../dao/factory.js";

const DAO = await PersistenceFactory.getPersistence();

import UsersService from "./users.service.js";
import CartsService from "./carts.service.js";
import ProductsService from "./products.service.js";
import TicketsService from "./Tickets.service.js";

export const userService = new UsersService(DAO.userDAO);
export const cartService = new CartsService(DAO.cartDAO);
export const productService = new ProductsService(DAO.productDAO);
export const ticketService = new TicketsService(DAO.ticketDAO);
