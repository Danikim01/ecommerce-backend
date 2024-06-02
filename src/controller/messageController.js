import { messageService } from "../repositories/index.js";

export default class messageController {

    async getAll(){
        return await messageService.getAllMessages();
    }

    async create(message){
        return await messageService.createMessage(message);
    }

}