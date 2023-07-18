const form = document.getElementById("restorePasswordForm")

form.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value))
    const result = await fetch('api/sessions/restorePassword', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const resultData = await result.json();
    console.log(resultData.status)
    if (resultData.status === 'succes') {
        window.location.replace('/products')
    }
})