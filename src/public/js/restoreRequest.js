const form = document.getElementById("restorePasswordForm");
const text = document.getElementById("text")

form.addEventListener("submit", async (evt) => {
  evt.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  console.log(obj);
  const result = await fetch("api/sessions/restoreRequest", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const resultData = await result.json();
  console.log(resultData);
  if (resultData.status === "error") {
    text.innerHTML = "No se encontro el correo electronico";
  }

  if (resultData.status === "success") {
    text.innerHTML = "Se envio el correo con exito, por favor revise su casilla de correos"
  }
});
