import messageModelDB from "../dao/services/messageManagerDB.js";

export default class messageController {
    constructor() {
        this.dao = new messageModelDB();
    }

    async getAll(){
        return await this.dao.getAllMessages();
    }

    async create(message){
        return await this.dao.createMessage(message);
    }

}