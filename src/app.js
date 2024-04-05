import express from "express";
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/cart.router.js"
import realTimeProductsRouter from "./routes/realTimeProducts.router.js"
import handlebars from "express-handlebars";
import {Server} from "socket.io";
import __dirname from "./path.js";
import ProductManager from "./dao/productManagerDB.js";
import mongoose from "mongoose";
import websocket from "./websocket.js";
import viewsRouter from "./routes/viewsRouter.js";

const app = express();
let pm = new ProductManager();

//Incializamos el motor de plantillas
app.engine("handlebars", handlebars.engine());
//Establecemos la ruta de vistas
app.set("views",`${__dirname}/views`);
//Establecemos el motor de renderizado
app.set("view engine", "handlebars");

app.use(express.static(`${__dirname}/../public`));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use("/api/realtimeproducts",realTimeProductsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);


const connection = async () => {
    try{
        await mongoose.connect("mongodb+srv://danikim:D46334737@cluster0.4erp6rc.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
        console.log("Conexion exitosa a la base de datos")
    }catch(error){
        console.log("Error al conectar a la base de datos: ", error);
    }
}

connection();

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});

const socketServer = new Server(httpServer);

websocket(socketServer);

// socketServer.on("connection", async socket => {
//     console.log("Nuevo cliente conectado -----> ", socket.id);

//     socket.on("sendProduct", async product => {
//         console.log("Recibi el producto: ", product);
//         await pm.createProduct(product)
//     });

//     let allProducts = await pm.getAllProducts();
//     if (allProducts.length !== 0){
//         console.log("Enviando todos los productos");
//         socket.emit("sendingAllProducts",allProducts);
//     }

//     socket.on("deleteProduct",async id => {
//         await pm.deleteProduct(id)
//         let allProducts = await pm.getAllProducts();
//         console.log("Enviando todos los productos despues de eliminar");
//         socket.emit("sendingAllProducts",allProducts);
//     })
// });