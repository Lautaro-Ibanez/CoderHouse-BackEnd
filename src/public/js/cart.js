const buttonAdd = document.querySelectorAll("#deleteProduct");
const cartId = document.querySelector(".cartClass").getAttribute("dataCartId");

buttonAdd.forEach((elem) => {
  elem.addEventListener("click", async function (ev) {
    ev.preventDefault();
    const productId = elem.getAttribute("dataId");
    const result = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "DELETE",
    });

    if (result.ok) {
      const productDiv = elem.closest(".product-box");
      productDiv.remove();
    }
  });
});
