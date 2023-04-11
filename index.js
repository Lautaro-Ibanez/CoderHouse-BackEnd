import ProductManager from "./managers/productManager.js";

const producto = new ProductManager();

const context = async () => {
  const consulta = await producto.getProducts();
  console.log(consulta);
};

context();
