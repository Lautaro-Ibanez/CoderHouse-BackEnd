import express, { urlencoded } from "express";
import productsRouter from "./routes/products-router.js";
import cartRouter from "./routes/cart-router.js";

const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.listen(8080, () => {
  console.log("Listening in port 8080");
});
