import express from "express";
import ProductManager from "./productManager.js";

const app = express();

const productos = new ProductManager();

app.get("/products", (req, res) => {
  const limit = req.query.limit || 0;
  productos.getProducts().then((resultado) => {
    let prom = resultado;
    if (limit > 0) {
      prom = prom.slice(0, limit);
      res.send(prom);
    } else {
      res.send(resultado);
    }
  });
});

app.get("/products/:pid", (req, res) => {
  productos.getProducts().then(resultado => {
    console.log(resultado)
    const productos = resultado;
    const producto = productos.find(u=> u.id === parseInt(req.params.pid))
    res.send(producto)
  });
});

app.listen(8080, () => {
  console.log("Listening in port 8080");
});
