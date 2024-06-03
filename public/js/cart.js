const socket = io();


function addProductToCart(pid,uid) {
    const message = {
        pid,
        uid
    }
    alert("Mando el mensaje por el socket")
    socket.emit('addProductToCart', message);
}