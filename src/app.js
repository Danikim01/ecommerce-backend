let express = require('express')
let ProductManager = require('./productManager');

let pm = new ProductManager();

const app = express()

app.use(express.urlencoded({extended: true}))

app.get("/", (req,res) => {
    let html = `
    <div style="display:flex;flex-direction:column;justify-content:center;align-items:center;height:80vh;font-family: Arial, Helvetica, sans-serif;">
        <h1>Bienvenido a la tienda de productos</h1>
        <p>Acceda a la ruta /products para ver los productos</p>
        <p>/products?limit para filtrar los productos</p>
        <p>/products/:pid para ver los detalles de un solo producto segun id</p>
    <div/>
    `    
    res.send(html)
})

app.get("/products", async (req,res) => {
    let limit = req.query.limit
    let allProducts = await pm.getProducts()
    if (limit){
        res.send(allProducts.slice(0,limit))    
    }
    else{
        res.send(allProducts)
    }   
})

app.get("/products/:pid", async (req,res) => {
    let id = req.params.pid
    let product = await pm.getProductById(id)
    res.send(product)
})


const PORT = 8080
app.listen(PORT,()  => {
    console.log('Server is running on port 8080, http://localhost:8080/')
})