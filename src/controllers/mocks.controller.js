import { generateProduct } from "../mocks/products-mock.js";

const getMockProducts = async (req, res) => {
  let products = [];
  for (let i = 0; i < 100; i++) {
    const product = generateProduct();
    products.push(product);
  }
  res.send({ status: "success", payload: products });
};

export default { getMockProducts };
