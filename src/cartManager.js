import fs, { existsSync } from "fs";

export default class CartManager {
  constructor() {
    this.path = "./src/files/cart.json";
  }

  getCarts = async () => {
    if (existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const cart = JSON.parse(data);
      return cart;
    } else {
      return [];
    }
  };

  getCartsById = async (id) => {
    const carts = await this.getCarts();
    if (carts.length > 0) {
      let cartById = null;
      for (let i = 0; i < carts.length; i++) {
        if (carts[i].id === id) {
          cartById = carts[i];
          return cartById;
        }
      }
      return "Not Found";
    }
  };

  addCart = async () => {
    const carts = await this.getCarts();

    const addCart = {
      products: [],
    };

    if (carts.length === 0) {
      addCart.id = 1;
    } else {
      addCart.id = carts[carts.length - 1].id + 1;
    }
    carts.push(addCart);

    await fs.promises.writeFile(this.path, JSON.stringify(carts, null, " "));
    return carts;
  };

  addProductToCart = async (cid, pid) => {
    const carts = await this.getCarts();
    const newProduct = {
      id: pid,
      quantity: 1,
    };

    for (let i = 0; i < carts.length; i++) {
      if (carts[i].id == cid) {
        if (carts[i].products.length === 0) {
          carts[i].products.push(newProduct);
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(carts, null, " ")
          );
          return carts;
        } else {
          for (let j = 0; j < carts[i].products.length; j++) {
            if (carts[i].products[j].id === pid) {
              carts[i].products[j].quantity += 1;
              await fs.promises.writeFile(
                this.path,
                JSON.stringify(carts, null, " ")
              );
              return carts;
            }
          }
          carts[i].products.push(newProduct);
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(carts, null, " ")
          );
          return carts;
        }
      }
    }
  };
}
