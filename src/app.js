import express from "express";
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/cart.router.js"
import handlebars from "express-handlebars";
import {Server} from "socket.io";
import __dirname from "./path.js";
import mongoose from "mongoose";
import websocket from "./websocket.js";
import viewsRouter from "./routes/viewsRouter.js";
import session from "express-session";
import mongoStore from "connect-mongo";
import usersRouter from "./routes/users.router.js";

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


const uri = "mongodb+srv://danikim:D46334737@cluster0.4erp6rc.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"

const connection = async () => {
    try{
        await mongoose.connect(uri)
        console.log("Conexion exitosa a la base de datos")

    }catch(error){
        console.log("Error al conectar a la base de datos: ", error);
    }
}

connection();

//Session Middleware
app.use(session(
    {
        store: mongoStore.create({mongoUrl: uri,ttl: 200}),
        secret: 'secretPhrase',
        resave: true,
        saveUninitialized: true
    }
))

app.use('/api/sessions', usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});

const socketServer = new Server(httpServer);

websocket(socketServer);
