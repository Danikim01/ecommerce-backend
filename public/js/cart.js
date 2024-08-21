const socket = io();

const service = 'stripe';

function addProductToCart(pid,uid,title,price) {
    const message = {
        pid,
        uid
    }
    socket.emit('addProductToCart', message);
}


async function purchase(cart_id){
    const url = service === 'mercadopago' 
        ? `/api/carts/${cart_id}/checkoutmp` 
        : `/api/carts/${cart_id}/checkoutstr`;

    const data = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });
    const jsonData = await data.json();
    window.location.href = jsonData.url;    
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