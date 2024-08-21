import express from "express";
import session from "express-session";
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/cart.router.js"
import mocksRouter from "./routes/mocks.router.js"
import handlebars from "express-handlebars";
import {Server} from "socket.io";
import __dirname from "./path.js";
import websocket from "./websocket.js";
import viewsRouter from "./routes/viewsRouter.js";
import usersRouter from "./routes/users.router.js";
import sessionsRouter from "./routes/session.router.js";
import passport from "passport";
import initializatePassport from './config/passportConfig.js';
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import addLogger from "./utils/logger.js";
import swaggerUiExpress from 'swagger-ui-express';
import specs from "./utils/swagger.js";
import cors from "cors";
import loggerTestRouter from "./routes/logger.router.js";
import connection from "./utils/db.connection.js";

const app = express();

import path from "path";

app.use(session({
    secret: 'session_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Asegúrate de ajustar esto a true si usas HTTPS
}));

//Incializamos el motor de plantillas
app.engine("handlebars", handlebars.engine());
//Establecemos la ruta de vistas
app.set("views", path.join(__dirname, 'views'));
//Establecemos el motor de renderizado
app.set("view engine", "handlebars");

app.use('/static',express.static(`${__dirname}/../public`));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(addLogger);


connection();

initializatePassport();
app.use(passport.initialize());


app.use('/api/sessions', sessionsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use('/api/users', usersRouter);
app.use('/api/docs',swaggerUiExpress.serve,swaggerUiExpress.setup(specs));
app.use("/mockingproducts", mocksRouter);
app.use("/loggerTest",loggerTestRouter);
app.use("/", viewsRouter);

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: ['GET', 'POST', 'PUT'],
    credentials: true
}));

const PORT = config.port || 8080;
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor activo en ${config.base_url}`);
});

const socketServer = new Server(httpServer);

websocket(socketServer);


export default app;