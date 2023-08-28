import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import cluster from "cluster";
import os from "os";

import viewsRouter from "./routes/views-router.js";
import ProductRouter from "./routes/products-router.js";
import CartRouter from "./routes/carts-router.js";
import SessionRouter from "./routes/session-router.js";
import mailRouter from "./routes/sendMessage-router.js";
import mockRouter from "./routes/mock-router.js";

import initializePassport from "./config/passport.config.js";
import attachLogger from "./middlewares/logger.js";

import errorHandler from "./middlewares/errors/index.js";
import helper from "./helpers/handlebarHelpers.js";
import config from "./config/config.js";
import registerChatHandler from "./listeners/chat-handler.js";
import __dirname from "./util.js";
import ViewsRouter from "./routes/views-router.js";
import UsersRouter from "./routes/users-router.js";

const cpus = os.cpus().length;

if (cluster.isPrimary) {
  console.log("Soy el proceso principal");
  for (let i = 0; i < cpus; i++) {
    cluster.fork();
  }
  cluster.on("exit", (worker) => {
    console.log(`El proceso ${worker.process.pid} murio`);
    console.log(`Levantando su reemplazo`);
    cluster.fork();
  });
} else {
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
  app.use(attachLogger);

  initializePassport();

  /*--------------------------  Handlebars  --------------------------*/
  app.engine("handlebars", handlebars.engine());
  app.set("views", `${__dirname}/views`);
  app.set("view engine", "handlebars");

  /*--------------------------  routes  --------------------------*/
  const sessionRouter = new SessionRouter();
  const productRouter = new ProductRouter();
  const cartRouter = new CartRouter();
  const viewsRouter = new ViewsRouter();
  const usersRouter = new UsersRouter();

  app.get("/loggerTest", (req, res) => {
    req.logger.debug(`log de debug`);
    req.logger.http(
      `${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`
    );
    req.logger.info(`log de info`);
    req.logger.warning(`log de warning`);
    req.logger.error(`log de error - ${new Date().toLocaleTimeString()}`);
    req.logger.fatal(
      `log de f                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           atal - ${new Date().toLocaleTimeString()}`
    );
    res.sendStatus(200);
  });

  app.get("/testQuery", (req, res) => {
    const query = req.query;
    console.log(query);
    res.sendStatus(200);
  });

  app.use("/", viewsRouter.getRouter());
  app.use("/api/products", productRouter.getRouter());
  app.use("/api/carts", cartRouter.getRouter());
  app.use("/api/sessions", sessionRouter.getRouter());
  app.use("/api/send", mailRouter);
  app.use("/api/users", usersRouter.getRouter())
  app.use("/", mockRouter);

  /*--------------------------  WebSockets  --------------------------*/
  io.on("connection", (socket) => {
    registerChatHandler(io, socket);
  });
  app.use(errorHandler);
}
