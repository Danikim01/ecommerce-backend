
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

function crearProducto(product){
    const div = document.createElement("div");
    div.classList.add("product-card");
    div.innerHTML = `
        <h3>${product.title}</h3>
        <p>${product.description}</p>
        <p>Precio: $${product.price}</p>
        <p>Stock: ${product.stock}</p>
    `;
    return div;
}

function crearProductos(productos){
    let html = "";
    productos.forEach(p => {
        html += `
            <div class="product-card">
                <h3>${p.title}</h3>
                <p>${p.description}</p>
                <p>Precio: $${p.price}</p>
                <p>Stock: ${p.stock}</p>
                <button class="delete-button" data-product-id="${p.id}">Eliminar</button>
            </div>
        `;
    });
    return html;
}

socket.on("sendingAllProducts", (products) => {
    contenedorProductos.innerHTML = crearProductos(products);
});


contenedorProductos.addEventListener("click", (e) => {
    if (e.target.classList.contains('delete-button')){
        let id = e.target.getAttribute("data-product-id");
        console.log("Eliminando producto con id: ", id);
        socket.emit("deleteProduct", id);
    }
})