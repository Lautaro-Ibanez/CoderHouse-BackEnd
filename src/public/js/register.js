const form = document.getElementById("registerForm")

form.addEventListener('submit', async (evt) => {
    evt.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value))
    console.log(obj);
    const result = await fetch('/api/sessions/register', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    })
    const resultData = await result.json();
    console.log(resultData)
    if (resultData.status === 'success') {
        window.location.replace('/login')
    }
})