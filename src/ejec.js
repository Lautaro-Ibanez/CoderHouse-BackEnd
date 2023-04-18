import ProductManager from "./productManager.js";

const productos = new ProductManager();

const context = async ()=>{
    const test = await productos.getProducts()
    console.log(test)
    productos.addProduct("hola", 2500, "soy", "producto", 436, 8);
}

context();