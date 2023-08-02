import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

import viewsRouter from "./routes/views-router.js";
import ProductRouter from "./routes/products-router.js";
import CartRouter from "./routes/carts-router.js";
import SessionRouter from "./routes/session-router.js";
import mailRouter from "./routes/sendMessage-router.js";
import mockRouter from "./routes/mock-router.js";

import initializePassport from "./config/passport.config.js";

import errorHandler from "./middlewares/errors/index.js";
import helper from "./helpers/handlebarHelpers.js";
import config from "./config/config.js";
import registerChatHandler from "./listeners/chat-handler.js";
import __dirname from "./util.js";

/*--------------------------  Server  --------------------------*/
const app = express();
const PORT = config.port || 8080;
const server = app.listen(PORT, () =>
  console.log(`Listening on port ${config.port}`)
);
const io = new Server(server);

/*--------------------------  middlewares  --------------------------*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());

initializePassport();

/*--------------------------  Handlebars  --------------------------*/
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

/*--------------------------  routes  --------------------------*/
const sessionRouter = new SessionRouter();
const productRouter = new ProductRouter();
const cartRouter = new CartRouter();

app.use("/", viewsRouter);
app.use("/api/products", productRouter.getRouter());
app.use("/api/carts", cartRouter.getRouter());
app.use("/api/sessions", sessionRouter.getRouter());
app.use("/api/send", mailRouter);
app.use("/", mockRouter);

/*--------------------------  WebSockets  --------------------------*/
io.on("connection", (socket) => {
  registerChatHandler(io, socket);
});
app.use(errorHandler);
