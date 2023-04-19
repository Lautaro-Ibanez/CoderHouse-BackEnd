import fs, { existsSync } from "fs";

export default class ProductManager {
  constructor() {
    this.path = "./src/files/productos.json";
  }

  getProducts = async () => {
    if (existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      return products;
    } else {
      return [];
    }
  };

  addProduct = async (title, price, description, thumbnail, code, stock) => {
    const productos = await this.getProducts();

    const addProduct = {
      title: title,
      price: price,
      description: description,
      thumbnail: thumbnail,
      code: code,
      stock: stock,
    };

    if (productos.length === 0) {
      addProduct.id = 1;
    } else {
      for (let i = 0; i < productos.length; i++) {
        if (productos[i].code === code) {
          console.log("Producto Repetido");
          return;
        }
      }
      addProduct.id = productos[productos.length - 1].id + 1;
    }
    productos.push(addProduct);

    await fs.promises.writeFile(
      this.path,
      JSON.stringify(productos, null, " ")
    );
    return productos;
  };

  getProductsById = async (id) => {
    const productos = await this.getProducts();
    if (productos.length > 0) {
      let productById = null;
      for (let i = 0; i < productos.length; i++) {
        if (productos[i].id === id) {
          productById = productos[i];
          return productById;
        }
      }
      return "Not Found";
    }
  };

  updateProduct = async (id, campo, valor) => {
    if (campo == id) {
      console.log("no se puede cambiar el ID");
      return;
    }
    const productos = await this.getProducts();
    const update = await this.getProductsById(id);
    update[campo] = valor;
    for (let i = 0; i < productos.length; i++) {
      if (productos[i].id == update.id) {
        productos[i] = update;
      }
    }
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(productos, null, " ")
    );
    return productos;
  };

  deleteProduct = async (id) => {
    const productos = await this.getProducts();
    for (let i = 0; i < productos.length; i++) {
      if (productos[i].id === id) {
        productos.splice(i, 1);
      }
    }
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(productos, null, " ")
    );
    return productos;
  };
}
