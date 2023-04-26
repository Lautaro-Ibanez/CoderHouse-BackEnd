import { Router } from "express";
import ProductManager from "../productManager.js";
const router = Router();

export default router;

const productos = new ProductManager();

router.get("/", (req, res) => {
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

router.get("/:pid", (req, res) => {
  const pid = parseInt(req.params.pid);
    productos.getProductsById(pid)
    .then((resultado)=>{
        res.send(resultado)
    })
});

router.post("/", (req, res) => {
  const product = req.body;
  productos.addProduct(
    product.title,
    product.price,
    product.description,
    product.thumbnail,
    product.code,
    product.stock,
    product.category
  );
  res.send({ status: "succes", message: "Product Added" });
});

router.put("/:pid", (req, res) => {
    const pid = parseInt(req.params.pid);
    const object = req.body;
    productos.updateProduct(pid,object)
    res.send({status: "succes", message: "Product Updated"})
});

router.delete("/:pid", (req,res) => {
    const id = parseInt(req.params.pid);
    productos.deleteProduct(id);
    res.send({status: "succes", message: "Product Deleted"})
})
