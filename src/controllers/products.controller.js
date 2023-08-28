import EErrors from "../services/errors/EEnum.js";
import CustomError from "../services/errors/CustomError.js";
import info from "../services/errors/info.js";
import { productService } from "../services/index.js";

const getProducts = async (req, res) => {
  // esta funcion devuelve todos los productos en la base de datos
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
  } = await productService.getProductsWithPaginate(filtros, {
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
    page,
  });
};

const addProduct = async (req, res, next) => {
  try {
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
    ) {
      CustomError.createError({
        name: "Product creation error",
        cause: info.generateProductErrorInfo({
          title,
          price,
          description,
          thumbnail,
          code,
          stock,
          status,
          category,
        }),
        message: "Error trying to create product",
        code: EErrors.INCOMPLETE_VALUES_ERROR,
        status: 400,
      });
    }

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
    const result = await productService.addProduct(product);
    res.send({ status: "succes", message: "Product Added" });
  } catch (err) {
    next(err);
  }
};

const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const result = await productService.getProductBy({ _id: pid });
    res.send({ status: "succes", payloads: result });
  } catch (err) {
    res.status(404).send({ status: "error", error: err });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const updateProduct = req.body;
    const result = await productService.updateProduct(pid, updateProduct);
    res.status(201).send({ status: "success", message: "Product Updated" });
  } catch (err) {
    res.status(404).send({ status: "error", error: "Product Not Found" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const result = await productService.deleteProduct(pid);
    res.send({ status: "succes", message: "Product Deleted" });
  } catch (err) {
    res.status(404).send({ status: "error", error: err });
  }
};

export default {
  getProducts,
  addProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
