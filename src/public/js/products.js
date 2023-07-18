const buttonAdd = document.querySelectorAll('#buttonAdd');
    const cartId = document.querySelector('#cartButton').getAttribute('cartData')
    const cartItemsCant = document.getElementById('cartItemsCant')
    fetch(`/api/carts/${cartId}/cantItems`, {
        method: 'GET'
    })
        .then((res) => res.json())
        .then((result) => cartItemsCant.innerHTML = result)


    buttonAdd.forEach(function (elem) {
        elem.addEventListener('click', async function (ev) {
            ev.preventDefault();
            const productId = this.getAttribute('dataId')
            await fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: 'POST'
            })
                .then((res) => res.json())

            const itemsInCart = await fetch(`/api/carts/${cartId}/cantItems`, {
                method: 'GET'
            })
                .then((res) => res.json())

            cartItemsCant.innerHTML = itemsInCart
        })



        elem.addEventListener('mousedown', function () {
            elem.classList.add('clicked')
        })

        elem.addEventListener('mouseup', function () {
            elem.classList.remove('clicked')
        })

    })