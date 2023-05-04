import express, { urlencoded } from "express";
import productsRouter from "./routes/products-router.js";
import cartRouter from "./routes/cart-router.js";
import viewsRouter from "./routes/views-rounter.js";
import handlebars from "express-handlebars";
import __dirname from "./util.js";
import { Server } from "socket.io";
import ProductManager from "./productManager.js";


const productos = new ProductManager();

const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsRouter);
const server = app.listen(8080, () => {
  console.log("Listening in port 8080");
});

const io = new Server(server);

const logs = [];


io.on("connection", (socket) => {
  
  productos.getProducts().then((res)=>{
    io.emit('getProducts', res)
  })

  console.log("nuevo cliente conectado");
  socket.on("message", (data) => {
    logs.push({ id: socket.id, message: data });
    console.log(logs);
    io.emit("logs", logs);
  });

  
});


