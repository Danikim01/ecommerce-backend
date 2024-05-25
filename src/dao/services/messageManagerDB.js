import messageModel from "../dao/models/messageModel.js"

export default class messageModelDB {
    async createMessage(data){
        try{
            await messageModel.create(data);
        }catch(error){
            console.error(error.message);
            throw new Error("Error al crear el mensaje");
        }
    }

    async getAllMessages(){
        try{
            return await messageModel.find().lean();
        }catch(err){
            console.error(err.message);
            throw new Error("Error al buscar los mensajes");
        }
    }
}