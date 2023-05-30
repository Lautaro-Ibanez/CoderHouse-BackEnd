import { Router, json } from "express";
import productMongo from "../dao/mongo/mongoManagers/product-mongo.js";
import productModel from "../dao/mongo/models/product-model.js";

const router = Router();
const products = new productMongo();

/*------------------------  End Points  ------------------------*/
router.get("/", async (req, res) => {
  let filtros = {};
  if (req.query.category) {
    filtros = { ...filtros, category: req.query.category };
  }

  const limit = parseInt(req.query.limit) || 10;
  let page = 0;
  if (Number(req.query.page) == 0) {
    page = 0;
  } else {
    page = Number(req.query.page) || 1;
  }
  const sort = parseInt(req.query.sort);
  const {
    docs,
    totalPages,
    prevPage,
    nextPage,
    hasPrevPage,
    hasNextPage,
    prevLink,
    nextLink,
    ...rest
  } = await productModel.paginate(filtros, {
    limit: limit,
    page: page,
    sort: sort ? { price: sort } : { _id: 1 },
  });
  if (page < 1 || page > totalPages) {
    return res.send({ status: "error", error: "Page not Found" });
  }

  res.send({
    status: "Succes",
    payloads: docs,
    totalPages,
    prevPage,
    nextPage,
    hasPrevPage,
    hasNextPage,
    prevLink,
    nextLink,
    page
  });
});

router.post("/", async (req, res) => {
  const {
    title,
    price,
    description,
    thumbnail,
    code,
    stock,
    status,
    category,
  } = req.body;
  if (
    !title ||
    !price ||
    !description ||
    !thumbnail ||
    !code ||
    !stock ||
    !category
  )
    return res
      .status(400)
      .send({ status: "error", error: "imcomplete values" });

  const product = {
    title,
    price,
    description,
    thumbnail,
    code,
    stock,
    status,
    category,
  };
  const result = await products.addProduct(product);
  res.send({ status: "succes", message: "Product Added" });
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const result = await products.getProductBy({ _id: pid });
    res.send({ status: "succes", payloads: result });
  } catch (err) {
    res.status(404).send({ error: "Product Not Found" });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updateProduct = req.body;
    const result = await products.updateProduct(pid, updateProduct);
    res.status(201).send({ message: "Product Updated" });
  } catch (err) {
    res.status(404).send({ error: "Product Not Found" });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const result = await products.deleteProduct(pid);
    res.send({ status: "succes", message: "Product Deleted" });
  } catch (err) {
    res.status(404).send({ error: "Product Not Found" });
  }
});

export default router;
