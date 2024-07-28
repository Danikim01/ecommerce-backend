import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

import {isValidPassword} from "../../../utils/functionsUtil.js";
import { createHash } from "../../../utils/functionsUtil.js";

import { generateNotEnoughDocumentsErrorInfo, generateDuplicatePasswordErrorInfo, generateUserNotFoundErrorInfo } from "../../../errors/info.js";
import CustomError from "../../../errors/CustomError.js";
import { ErrorCodes } from "../../../errors/enums.js";

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
            const user = await userModel.findOne({_id: uid}).lean();
            return user
        }catch(error){
            console.error(error.message);
            throw new Error("Error al obtener el usuario");
        }
    }

    async getUserByEmail(email){
        try{
            const user = await userModel.findOne({email: email}).lean();
            if (user) return true
            return false
        }catch(error){
            console.error(error.message);
            throw new Error("Error al obtener el usuario");
        }
    }

    async register(user){
        const {first_name, last_name, email, age, password,role} = user;
        if (!first_name || !last_name || !email || !age || !password || !role){
            throw new Error("Campo incompleto, por favor complete todos los campos");
        }
        try{
            const new_user = await userModel.create({first_name, last_name, email, age, password, role});
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
            //delete user.password
            //update last_connection field from user with the current timestamp
            const current_date = new Date();
            user.last_connection = current_date.toLocaleString();
            const res = await userModel.updateOne({email: email}, user);
            return jwt.sign(user,"coderSecret",{expiresIn: "1h"});
        }catch(error){
            console.error(error.message);
            throw new Error(errormessage);
        }
    }

    async restorePassword(email, new_password){
        const user = await userModel.findOne({email: email}).lean();
        if (!user){
            CustomError.createError(
                {
                    name: "UserNotFoundError",
                    cause: generateUserNotFoundErrorInfo(),
                    message: "The user does not exist",
                    code: ErrorCodes.USER_NOT_FOUND_ERROR,
                }
            )
        }
        if (isValidPassword(user, new_password)){
            CustomError.createError(
                {
                    name: "DuplicatePasswordError",
                    cause: generateDuplicatePasswordErrorInfo(),
                    message: "The new password is the same as the old password. Please choose another one.",
                    code: ErrorCodes.DUPLICATE_PASSWORD_ERROR,
                }
            ) 
        }
        const newPassword = createHash(new_password);
        user.password = newPassword;
        await userModel.updateOne({email: email}, user);
        return user;
    }

    async changeRole(uid){
        const user = await userModel.findOne({_id: uid}).lean();
        if (!user){
            CustomError.createError(
                {
                    name: "UserNotFoundError",
                    cause: generateUserNotFoundErrorInfo(),
                    message: "The user does not exist",
                    code: ErrorCodes.USER_NOT_FOUND_ERROR,
                }
            )
        }
        if (user.role === "user"){
            //check if the user documents file has at leas 3 elements
            if (user.documents.length < 3){
                CustomError.createError(
                    {
                        name: "NotEnoughDocumentsError",
                        cause: generateNotEnoughDocumentsErrorInfo(),
                        message: "The user does not have enough documents",
                        code: ErrorCodes.NOT_ENOUGH_DOCUMENTS_ERROR,
                    }
                )
            }else{
                user.role = "premium";
            }
        }else if (user.role === "premium"){
            user.role = "user";
        }
        await userModel.updateOne({_id: uid}, user);
    }

    async deleteUserByEmail(email){
        try{
            const user = await userModel.findOne({email: email});
            if (!user){
                throw new Error("Usuario no encontrado");
            }
            //delete user from database
            return await userModel.deleteOne({email: email});
        }catch(error){
            console.error(error.message);
            throw new Error("Error al borrar el usuario");
        }
    }

    async logout(uid){
        try{
            const user = await userModel.findOne({_id: uid});
            if (!user){
                throw new Error("Usuario no encontrado");
            }
            //update last_connection field from user with the current timestamp
            const current_date = new Date();
            user.last_connection = current_date.toLocaleString();
            const res = await userModel.updateOne({_id: uid}, user);
            return res;
        }catch(error){
            console.error(error.message);
            throw new Error("Error al cerrar la sesion");
        }
    }

    async uploadDocuments(uid, files){
        try{
            const user = await userModel.findOne({_id: uid});
            if (!user){
                throw new Error("Usuario no encontrado");
            }
            const documents = user.documents;
            //append the new files to the documents array
            for (const file of files){
                // if (documents.some(doc => doc.name === file.originalname)){
                //     continue;
                // }
                documents.push({name: file.originalname, reference: file.path});
            }
            user.documents = documents;
            const update = await userModel.updateOne({_id:uid}, user);
            return update
        }catch(err){
            console.error(err);
            throw new Error("Error al subir los documentos");
        }
    }
}

