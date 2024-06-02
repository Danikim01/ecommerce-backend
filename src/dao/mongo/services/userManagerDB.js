import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import {isValidPassword} from "../../../utils/functionsUtil.js";

export default class userManagerDB {

    async getAllUsers(){
        try{
            return await userModel.find().lean();
        }catch(error){
            console.error(error.message);
            throw new Error("Error al obtener los usuarios");
        }
    }

    async getUser(uid){
        try{
            return await userModel.findOne({_id: uid}).lean();
        }catch(error){
            console.error(error.message);
            throw new Error("Error al obtener el usuario");
        }
    }

    async register(user){
        const {first_name, last_name, email, age, password} = user;
        console.log(user)
        if (!first_name || !last_name || !email || !age || !password){
            throw new Error("Campo incompleto, por favor complete todos los campos");
        }
        try{
            await userModel.create({first_name, last_name, email, age, password});
        }catch(error){
            console.error(error.message);
            throw new Error("Error al registrar el usuario");
        }
    }

    async login(email, password){
        const errormessage = "Credenciales incorrectas, por favor intente de nuevo";
        if (!email || !password){
            throw new Error(errormessage);
        }
        try{
            const user = await userModel.findOne({email: email}).lean();
            if (!user) throw new Error(errormessage);
            if (!isValidPassword(user, password)) throw new Error(errormessage);
            delete user.password
            return jwt.sign(user,"coderSecret",{expiresIn: "1h"});
        }catch(error){
            console.error(error.message);
            throw new Error(errormessage);
        }
    }
}

