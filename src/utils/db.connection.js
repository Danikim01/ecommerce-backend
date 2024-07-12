import config from "../config/config.js";
import mongoose from "mongoose";

const uri = config.mongoUri

const connection = async () => {
    try{
        await mongoose.connect(uri)
        console.log("Conexion exitosa a la base de datos")
    }catch(error){
        console.log("Error al conectar a la base de datos: ", error);
    }
}

export default connection;
