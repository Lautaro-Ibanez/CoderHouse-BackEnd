import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";

import viewsRouter from "./routes/views-router.js";
import productsRouter from "./routes/products-router.js";
import cartRouter from "./routes/carts-router.js";
import sessionRouter from "./routes/session-router.js";

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
app.use(cookieParser());
app.use(
  session({
    store: new MongoStore({
      mongoUrl: urlAtlas,
      ttl: 300,
    }),
    secret: "secreto123",
    resave: false,
    saveUninitialized: false,
  })
);

/*--------------------------  routes  --------------------------*/
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionRouter);

/*--------------------------  Handlebars  --------------------------*/
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

/*--------------------------  Cookies  --------------------------*/

app.get("/setCookie", (req, res) => {
  res.cookie("Codercookie", "Esto es una cookie muy poderosa").send("Cookie");
});

app.get("/getCookie", (req, res) => {
  res.send(req.cookies);
});

app.get("/deleteCookie", (req, res) => {
  res.clearCookie("Codercookie").send("removed cookie");
});

/*--------------------------  Sessions  --------------------------*/



app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.send("Logout ok");
    } else {
      res.send({ status: "Logout error", body: err });
    }
  });
});

/*--------------------------  WebSockets  --------------------------*/
io.on("connection", (socket) => {
  registerChatHandler(io, socket);
});
