
const socket = io();

const title = document.querySelector("#title")
const description = document.querySelector("#description")
const price = document.querySelector("#price")
const stock = document.querySelector("#stock")
const category = document.querySelector("#category")
const code = document.querySelector("#code")
const button = document.querySelector("#submit-button")

function send(){
    const product = {
        title: title.value,
        description: description.value,
        price: price.value,
        category: category.value,
        code: code.value,
        stock: stock.value
    }
    console.log("Enviando producto: ", product);
    title.value = "";
    description.value = "";
    price.value = "";
    stock.value = "";
    category.value = "";
    code.value = "";
    socket.emit("sendProduct", product);
}

const contenedorProductos = document.querySelector("#productos");

// function crearProducto(product){
//     const div = document.createElement("div");
//     div.classList.add("product-card");
//     div.innerHTML = `
//         <h3>${product.title}</h3>
//         <p>${product.description}</p>
//         <p>Precio: $${product.price}</p>
//         <p>Stock: ${product.stock}</p>
//         <button class="delete-button" onclick="deleteProduct(${product.id})" data-product-id="${product.id}">Eliminar</button>
//     `;
//     return div;
// }

function crearProductos(productos){
    let html = "";
    productos.forEach(product => {
        html += 
        `<div class="product-card">
            <h3>${product.title}</h3>
            <hr>
            <p>Categoria: ${product.category}</p>
            <p>Descripción: ${product.description}</p>
            <p>Precio: $ ${product.price}</p>
            <button id="button-delete" onclick="deleteProduct(${product.id})">Eliminar</button>
        </div>`;
    });
    return html;
}

socket.on("sendingAllProducts", (products) => {
    console.log("Recibiendo todos los productos: ", products);
    contenedorProductos.innerHTML = crearProductos(products);
});

socket.on("statusError", (error) => {
    console.error(error);
    alert(error)
});


function deleteProduct(pid) {
    console.log("Eliminando producto con id: ", pid);
    socket.emit('deleteProduct', { pid });
}

// contenedorProductos.addEventListener("click", (e) => {
//     if (e.target.classList.contains('delete-button')){
//         let id = e.target.getAttribute("data-product-id");
//         console.log("Eliminando producto con id: ", id);
//         socket.emit("deleteProduct", id);
//     }
// })