import MessageDTO from "../dao/dto/messageDTO.js";

export default class MessageRepository{
    constructor(dao){
        this.dao = dao;
    }

    async getAllMessages(){
        return await this.dao.getAllMessages();
    }

    async createMessage(message){
        const messageDTO = new MessageDTO(message);
        return await this.dao.createMessage(messageDTO);
    }

}