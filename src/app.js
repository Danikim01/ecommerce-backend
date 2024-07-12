import express from "express";
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/cart.router.js"
import mocksRouter from "./routes/mocks.router.js"
import handlebars from "express-handlebars";
import {Server} from "socket.io";
import __dirname from "./path.js";
import websocket from "./websocket.js";
import viewsRouter from "./routes/viewsRouter.js";
import usersRouter from "./routes/users.router.js";
import userRolesRouter from "./routes/roles.router.js";
import passport from "passport";
import initializatePassport from './config/passportConfig.js';
import cookieParser from "cookie-parser";
import config from "./config/config.js";
import addLogger from "./utils/logger.js";
import swaggerUiExpress from 'swagger-ui-express';
import specs from "./utils/swagger.js";

import loggerTestRouter from "./routes/logger.router.js";
import connection from "./utils/db.connection.js";

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
app.use(cookieParser());
app.use(addLogger);


connection();

initializatePassport();
app.use(passport.initialize());


app.use('/api/sessions', usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use('/api/users', userRolesRouter);
app.use('/api/docs',swaggerUiExpress.serve,swaggerUiExpress.setup(specs));
app.use("/mockingproducts", mocksRouter);
app.use("/loggerTest",loggerTestRouter);
app.use("/", viewsRouter);

const PORT = config.port
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});

const socketServer = new Server(httpServer);

websocket(socketServer);
