import messageModel from "./models/messageModel.js"

export default class messageModelDB {
    async createMessage(data){
        try{
            await messageModel.create(data);
        }catch(error){
            console.error(error.message);
            throw new Error("Error al crear el mensaje");
        }
    }
}