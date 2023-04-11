import { promises } from "dns";
import fs, { existsSync } from "fs";

export default class ProductManager {
  constructor() {
    this.path = "./files/productos.json";
  }

  getProducts = async () => {
    if (existsSync(this.path)) {
      const data = await fs.promises.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      return products;
    }else {
        return [];
    }

  };

  addProducts = async (title, price, description, thumbnail, code, stock) => {
    const productos = await this.getProducts()

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
            if (productos[i].code === code){
                console.log ("Producto Repetido")
                return 
                
            }
            
        }
        addProduct.id = productos[productos.length-1].id + 1;
    }

        productos.push(addProduct);
        await fs.promises.writeFile(this.path,JSON.stringify(productos,null,'/t'))
        return productos
  };

  getProductsById = (id) => {
    if (this.products.length > 0) {
      let productById = null;
      for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id === id) {
          productById = this.products[i];
          return productById;
        }
      }
      return "Not Found";
    }
  };
}
