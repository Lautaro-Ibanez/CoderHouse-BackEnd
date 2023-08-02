import CustomError from "../services/errors/customError.js";
import {
  cartService,
  productService,
  ticketService,
} from "../services/index.js";
import mongoose from "mongoose";
import generateInsertProductToCartErrorInfo from "../services/errors/info.js";
import EErrors from "../services/errors/EEnum.js";

const uniqueCodeGenerator = () => {
  const fechaActual = new Date().getTime();
  const numeroAleatorio = Math.floor(Math.random() * 10000);
  return `${fechaActual}-${numeroAleatorio}`;
};

const generateTicket = (amount, purchaser) => {
  const code = uniqueCodeGenerator();
  const ticket = {
    code,
    amount,
    purchaser,
  };
  return ticket;
};

const cartExistence = async (cid) => {
  // funcion reutilizable para buscar existencia de carrito
  const cart = await cartService.getCartBy({ _id: cid });
  if (!cart)
    return res.status(404).send({ status: "error", error: "Cart not found" });
  return cart;
};

const productExistence = async (pid) => {
  // funcion reutilizable para buscar existencia de producto
  const product = await productService.getProductBy({ _id: pid });
  if (!product)
    return res
      .status(404)
      .send({ status: "error", error: "Product not found" });
  return product;
};

const productsInCart = (cart) => {
  // esta funcion, recibe un objeto cart como parametro, luego mediante un for
  // recorre el array products de dicho cart para sumar los quantity en la variable cantidad
  let cantidad = 0;
  for (let i = 0; i < cart.products.length; i++) {
    cantidad += cart.products[i].quantity;
  }
  return cantidad;
};

const getCarts = async (req, res) => {
  // traigo todos los carritos
  const result = await cartService.getAllCarts();
  res.send({ status: "success", payload: result });
};

const addCart = async (req, res) => {
  // creo un carrito
  const result = await cartService.addCart();
  res.send({ status: "succes", message: "Cart Added", payload: result });
};

const getCartById = async (req, res) => {
  // busco un carrito con el cid (referencia a cart id) pasado por params y lo traigo
  try {
    const { cid } = req.params;
    const result = await cartService.getCartBy({ _id: cid });
    res.send({ status: "succes", payload: result });
  } catch (err) {
    res.status(404).send({ status: "error", error: "Cart Not Found" });
  }
};

const getQuantityItems = async (req, res) => {
  // busco un carrito con el cid (referencia a cart id) y luego,
  // aplico la logica para sumar todos los quantity de sus respectivos products
  try {
    const { cid } = req.params;
    const cart = await cartService.getCartBy({ _id: cid });
    const quantityCartItems = productsInCart(cart);
    res.status(200).send(quantityCartItems.toString());
  } catch (error) {
    res.status(400).send({ error: error });
  }
};

const addProductToCart = async (req, res, next) => {
  // esta funcion agrega un producto al carrito con un quantity inicial de 1
  // o aumenta este valor en 1 si dicho producto ya se encuentra en el carrito
  try {
    const { cid, pid } = req.params;

    // me fijo si existe carrito
    cartExistence(cid);

    // me fijo si existe producto
    productExistence(pid);

    // primera consulta, si no hay producto lo agrego con quantity = 1
    const productNotExist = await cartService.addProductToCart(cid, pid);
    if (productNotExist)
      return res.send({ status: "Succes", message: "Product Added To Cart" });

    // segunda consulta, si ya esta el producto aumento su quantity en 1
    const productExists = await cartService.incrementProduct(cid, pid);
    if (productExists)
      return res.send({ status: "Succes", message: "Product increment one" });

    // en caso de que fallen las consultas
    CustomError.createError({
      name: "Insert product to cart error",
      cause: generateInsertProductToCartErrorInfo(
        productService.getProductBy(
          { _id: pid },
          cartService.getCartBy({ _id: cid })
        )
      ),
      message: "Error when trying to add product to cart",
      code: EErrors.DATABASE_ERROR,
    });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (req, res) => {
  // esta funcion elimina en su totalidad un producto dentro de un carrito
  // primero busco el carrito y si el objeto existe en este
  // segundo busca el producto mediante pid
  // luego si se completa la consulta responde con succes y sino con error
  const { cid, pid } = req.params;
  try {
    const cart = await cartService.getCartBy({ _id: cid });
    const productInCart = cart.products.find(
      (product) => product.productId._id.toString() === pid
    );
    if (!productInCart)
      return res
        .status(404)
        .send({ status: "error", message: "Product not found" });
    await cartService.deleteProductFromCart(cid, pid);
    res.send({ status: "succes", message: "Product Deleted" });
  } catch {
    res.status(404).send({ status: "error", error: "error deleting product" });
  }
};

const cartUpdateWithBody = async (req, res) => {
  // esta funcion busca un carrito son cid y luego mediante un objeto recibido por el body
  // actualiza los productos del carrito
  try {
    const { cid } = req.params;
    const arrayProducts = req.body;
    const productsWithObjectId = arrayProducts.products.map((product) => ({
      productId: new mongoose.Types.ObjectId(product.productId),
      quantity: product.quantity,
    }));
    const result = await cartService.updateCart(cid, productsWithObjectId);
    if (result) {
      return res
        .status(200)
        .send({ status: "succes", message: "Cart Updated" });
    }
  } catch (err) {
    res.status(500).send({ error: "Internal server error" });
  }
};

const productInCartUpdate = async (req, res) => {
  // esta funcion busca el producto dentro de un carrito y acualiza su quantity
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    if (quantity <= 0) {
      return res.status(400).send({ error: "incorrect values" });
    }

    // me fijo si existe carrito
    cartExistence(cid);

    // me fijo si existe producto
    productExistence(pid);

    const result = await cartService.updateProductInCart(cid, pid, quantity);
    if (result) {
      return res
        .status(200)
        .send({ status: "succes", message: "Product Quantity Updated" });
    }
  } catch {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const deleteCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const result = await cartService.deleteCart(cid);
    if (!result)
      return res
        .status(404)
        .send({ status: "error", message: "Cart not found" });
    return res.status(200).send({ status: "success", message: "Cart deleted" });
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

const purchase = async (req, res) => {
  // defino parametros que voy a utilizar para construir el controlador
  const { cid } = req.params;
  const user = req.user;
  const cart = await cartService.getCartBy({ _id: cid });
  const arrayProducts = cart.products;

  // la siguiente variable se utiliza para almacenar los productos
  // que no tengan la disponibilidad de stock solicitada
  let productsOutStock = [];

  // totalPrice acumula el precio total de los productos
  // que si tengan disponibilidad de stock solicitado
  let totalPrice = 0;

  // si el carrito esta vacio, devuelvo un error
  if (arrayProducts.length <= 0) {
    return res
      .status(400)
      .send({ status: "error", error: "no products in the cart" });
  }

  // passProduct la utilizo como acumulador para saber si por lo menos un producto
  // se logro "completar su compra"
  let passProductCount = 0;

  // por cada producto dentro del carrito del usuario, se verifica si la cantidad solicitada
  // es menor o mayor que el stock disponible

  arrayProducts.forEach(async (product) => {
    if (product.quantity <= product.productId.stock) {
      const newStock = {
        stock: product.productId.stock - product.quantity,
      };

      totalPrice += product.productId.price * product.quantity;
      passProductCount = passProductCount + 1;
      await productService.updateProduct(product.productId._id, newStock);
      await cartService.deleteProductFromCart(cid, product.productId._id);
    } else {
      productsOutStock.push(product.productId._id);
    }
  });

  // utilizo la funcion para generar un codigo unico que se insertara en el ticket

  // ahora si passProduct es = 0 entonces ningun producto
  // logro completar su compra por lo tanto solo si passProduct > 0 genero el ticket.

  if (passProductCount > 0 && productsOutStock.length === 0) {
    const ticket = generateTicket(totalPrice, user.email);
    const result = await ticketService.addTicket(ticket);
    return res
      .status(200)
      .send({ status: "success", message: "purchase completed successfully" });
  }

  if (passProductCount > 0 && productsOutStock.length > 0) {
    const ticket = generateTicket(totalPrice, user.email);
    const result = await ticketService.addTicket(ticket);
    return res.status(200).send({
      status: "succes",
      message:
        "The purchase was completed successfully, but some products are not in the requested quantity",
      payload: productsOutStock,
    });
  }

  if (passProductCount === 0 && productsOutStock.length > 0) {
    return res.status(400).send({
      status: "error",
      message: "sorry, we don't have stock at the moment",
      payload: productsOutStock,
    });
  }

  return res.status(500).send({ status: "error", message: "Purchase error" });
};

export default {
  getCarts,
  addCart,
  getCartById,
  getQuantityItems,
  addProductToCart,
  deleteProduct,
  cartUpdateWithBody,
  productInCartUpdate,
  deleteCart,
  purchase,
};
