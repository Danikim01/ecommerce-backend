const socket = io();


function addProductToCart(pid,uid) {
    const message = {
        pid,
        uid
    }
    socket.emit('addProductToCart', message);
}

socket.on("statusError", (error) => {
    console.error(error);
    alert(error)
});