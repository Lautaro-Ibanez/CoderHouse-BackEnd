import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";

import viewsRouter from "./routes/views-router.js";
import productsRouter from "./routes/products-router.js";
import cartRouter from "./routes/carts-router.js";

import registerChatHandler from "./listeners/chat-handler.js";
import __dirname from "./util.js";

/*--------------------------  Server  --------------------------*/
const app = express();
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
const io = new Server(server);
const urlAtlas =
  "mongodb+srv://EntregaCoder:123@ecommerce.ipofbng.mongodb.net/ecommerce?retryWrites=true&w=majority";
const connection = mongoose.connect(urlAtlas);

/*--------------------------  middlewares  --------------------------*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

/*--------------------------  routes  --------------------------*/
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

/*--------------------------  Handlebars  --------------------------*/
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

/*--------------------------  WebSockets  --------------------------*/
io.on("connection", (socket) => {
  registerChatHandler(io, socket);
});
