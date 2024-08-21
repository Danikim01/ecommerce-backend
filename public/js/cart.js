const socket = io();

const cart = [];
const service = 'mercadopago';

function addProductToCart(pid,uid,title,price) {
    const message = {
        pid,
        uid
    }
    let newProduct = {};
    switch (service) {
        case 'mercadopago':
            newProduct = {
                title: title,
                unit_price: parseInt(price),
                quantity: 1,
                currency_id: 'ARS'
            }
            break;

        case 'stripe':
        default:
            newProduct = {
                price_data: {
                    product_data: {
                        name: title
                    },
                    currency: 'usd',
                    unit_amount: parseInt(price * 100), // * 100 pq opera en centavos
                },
                quantity: 1
            }
    }
    cart.push(newProduct);
    localStorage.setItem('cart', JSON.stringify(cart));
    socket.emit('addProductToCart', message);
}

// Al cargar la página, recuperar el carrito del almacenamiento local
window.onload = function() {
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    if (storedCart) {
        cart.push(...storedCart);
    }
};

async function purchase(cart_id){
    console.log("cart: ",cart)
    if (cart.length > 0) {
        console.log("entraaa")
        const url = service === 'mercadopago' 
            ? `/api/carts/${cart_id}/checkoutmp` 
            : `/api/carts/${cart_id}/checkoutstr`;

        const data = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cart)
        });
        const jsonData = await data.json();
        window.location.href = jsonData.url;
        // Limpiar el carrito del localStorage
        localStorage.removeItem('cart');
    } else {
        alert("Agrega productos al carrito para continuar con la compra");
    } 
}

//upon removing product reload the page to refresh the new changes in the cart
function removeProduct(cid,pid) {
    const message = {
        cid,
        pid
    }
    //alert("cid: " + message.cid + "pid: " + message.pid)
    socket.emit('removeProduct', message);
}

socket.on("productRemoved", () => {
    location.reload();
});




socket.on("statusError", (error) => {
    console.error(error);
    alert(error)
});