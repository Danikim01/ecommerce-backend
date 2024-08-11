
const socket = io();

const title = document.querySelector("#title")
const description = document.querySelector("#description")
const price = document.querySelector("#price")
const stock = document.querySelector("#stock")
const category = document.querySelector("#category")
const code = document.querySelector("#code")
const button = document.querySelector("#submit-button")

const contenedorProductos = document.querySelector("#productos");


function crearProductos(productos, userEmail){
    let html = "";
    productos.forEach(product => {
        html += 
        `<div class="product-card">
            <h3>${product.title}</h3>
            <hr>
            <p>Categoria: ${product.category}</p>
            <p>Descripción: ${product.description}</p>
            <p>Precio: $ ${product.price}</p>
            <p>Dueño: ${product.owner}</p>
            <button id="button-delete" data-email='${userEmail}' onclick="deleteProduct('${product._id}')">Eliminar</button>
        </div>`;
    });
    return html;
}

socket.on("sendingAllProducts", (products) => {
    const contenedorProductos = document.getElementById('productos');
    const userEmail = contenedorProductos.getAttribute('data-email');
    contenedorProductos.innerHTML = crearProductos(products, userEmail);
});

function deleteProduct(pid) {
    const contenedorProductos = document.getElementById('productos');
    const userEmail = contenedorProductos.getAttribute('data-email');
    socket.emit('deleteProduct', { pid, userEmail });
}

socket.on("statusError", (error) => {
    alert(error)
});


