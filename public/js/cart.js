const socket = io();


function addProductToCart(pid,uid) {
    const message = {
        pid,
        uid
    }
    socket.emit('addProductToCart', message);
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

// socket.on("productRemoved", () => {
//     location.reload();
// });



socket.on("sendingCartProducts", (cartProducts) => {
    const contenedorProductos = document.querySelector(".cart-product-card");
    contenedorProductos.getId

});

socket.on("statusError", (error) => {
    console.error(error);
    alert(error)
});