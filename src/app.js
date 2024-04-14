import express from "express";
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/cart.router.js"
import handlebars from "express-handlebars";
import {Server} from "socket.io";
import __dirname from "./path.js";
import mongoose from "mongoose";
import websocket from "./websocket.js";
import viewsRouter from "./routes/viewsRouter.js";


const app = express();


//Incializamos el motor de plantillas
app.engine("handlebars", handlebars.engine());
//Establecemos la ruta de vistas
app.set("views",`${__dirname}/views`);
//Establecemos el motor de renderizado
app.set("view engine", "handlebars");

app.use(express.static(`${__dirname}/../public`));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

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

// const insertManyProducts = async () => {
//     try {
//         // Array de productos a insertar
//         const products = [
//             { title: "Producto 1", description: "Descripción del producto 1", code: "P001", price: 10, stock: 100, category: "Categoria 1" },
//             { title: "Producto 2", description: "Descripción del producto 2", code: "P002", price: 20, stock: 200, category: "Categoria 2" },
//             { title: "Producto 3", description: "Descripción del producto 3", code: "P003", price: 15, stock: 150, category: "Categoria 3" },
//             { title: "Producto 4", description: "Descripción del producto 4", code: "P004", price: 25, stock: 250, category: "Categoria 4" },
//             { title: "Producto 5", description: "Descripción del producto 5", code: "P005", price: 30, stock: 300, category: "Categoria 5" },
//             { title: "Producto 6", description: "Descripción del producto 6", code: "P006", price: 18, stock: 180, category: "Categoria 1" },
//             { title: "Producto 7", description: "Descripción del producto 7", code: "P007", price: 22, stock: 220, category: "Categoria 2" },
//             { title: "Producto 8", description: "Descripción del producto 8", code: "P008", price: 12, stock: 120, category: "Categoria 3" },
//             { title: "Producto 9", description: "Descripción del producto 9", code: "P009", price: 28, stock: 280, category: "Categoria 4" },
//             { title: "Producto 10", description: "Descripción del producto 10", code: "P010", price: 35, stock: 350, category: "Categoria 5" },
//             { title: "Producto 11", description: "Descripción del producto 11", code: "P011", price: 14, stock: 140, category: "Categoria 1" },
//             { title: "Producto 12", description: "Descripción del producto 12", code: "P012", price: 24, stock: 240, category: "Categoria 2" },
//             { title: "Producto 13", description: "Descripción del producto 13", code: "P013", price: 17, stock: 170, category: "Categoria 3" },
//             { title: "Producto 14", description: "Descripción del producto 14", code: "P014", price: 27, stock: 270, category: "Categoria 4" },
//             { title: "Producto 15", description: "Descripción del producto 15", code: "P015", price: 32, stock: 320, category: "Categoria 5" },
//             { title: "Producto 16", description: "Descripción del producto 16", code: "P016", price: 16, stock: 160, category: "Categoria 1" },
//             { title: "Producto 17", description: "Descripción del producto 17", code: "P017", price: 21, stock: 210, category: "Categoria 2" },
//             { title: "Producto 18", description: "Descripción del producto 18", code: "P018", price: 19, stock: 190, category: "Categoria 3" },
//             { title: "Producto 19", description: "Descripción del producto 19", code: "P019", price: 29, stock: 290, category: "Categoria 4" },
//             { title: "Producto 20", description: "Descripción del producto 20", code: "P020", price: 33, stock: 330, category: "Categoria 5" }
//         ];
        
//         // Ejecutar el insertMany para agregar los productos a la base de datos
//         const result = await productModel.insertMany(products);

//         console.log("Productos insertados correctamente:", result);
//     } catch (error) {
//         console.error("Error al insertar los productos:", error);
//     }
// };

// insertManyProducts();

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});

const socketServer = new Server(httpServer);

websocket(socketServer);
