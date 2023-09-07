const buttonAdd = document.querySelectorAll("#buttonAdd");
const cartId = document.querySelector("#cartButton").getAttribute("cartData");
const cartItemsCant = document.getElementById("cartItemsCant");
fetch(`/api/carts/${cartId}/cantItems`, {
  method: "GET",
})
  .then((res) => res.json())
  .then((result) => (cartItemsCant.innerHTML = result.payload.toString()));

buttonAdd.forEach(function (elem) {
  elem.addEventListener("click", async function (ev) {
    ev.preventDefault();
    const productId = this.getAttribute("dataId");
    await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: "POST",
    }).then((res) => res.json());

    const itemsInCart = await fetch(`/api/carts/${cartId}/cantItems`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => (cartItemsCant.innerHTML = data.payload.toString()));
  });

  elem.addEventListener("mousedown", function () {
    elem.classList.add("clicked");
  });

  elem.addEventListener("mouseup", function () {
    elem.classList.remove("clicked");
  });
});
