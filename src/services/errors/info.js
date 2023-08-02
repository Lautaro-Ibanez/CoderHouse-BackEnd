const generateProductErrorInfo = (product) => {
  return `one or more properties were incomplete or not valid.
    List of required properties :
    * title : needs to be a String, received ${product.title}
    * price : needs to be a Number, received ${product.price}
    * description : needs to be a String, received ${product.description}
    * thumbnail : needs to be a URL, received ${product.thumbnail}
    * code : needs to be a String, received ${product.code}
    * stock : needs to be a Number, received ${product.stock}
    * status : needs to be a Boolean, received ${product.status}
    * category : needs to be a String, received ${product.category}`;
};

const generateInsertProductToCartErrorInfo = (product, cart) => {
  return `No product and cart found.
    *product: needs to be a Object, received ${product}
    *cart : needs to be a Object, received ${cart}`;
};

export default {
  generateProductErrorInfo,
  generateInsertProductToCartErrorInfo,
};
