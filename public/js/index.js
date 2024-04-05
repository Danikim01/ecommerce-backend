
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
            <button id="button-delete" onclick="deleteProduct('${product._id}')">Eliminar</button>
        </div>`;
    });
    return html;
}

socket.on("sendingAllProducts", (products) => {
    contenedorProductos.innerHTML = crearProductos(products);
});

socket.on("statusError", (error) => {
    console.error(error);
    alert(error)
});


function deleteProduct(pid) {
    socket.emit('deleteProduct', { pid });
}
