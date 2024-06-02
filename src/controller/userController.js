import { usersService } from "../repositories/index.js"; 

export default class userController {
    async getAllUsers(){
        return await usersService.getAllUsers();
    }

    async createUser(user){
        return await usersService.createUser(user);
    }

    async login(email, password){
        return await usersService.login(email, password);
    }

    async getUser(uid){
        return await usersService.getUser(uid);
    }

}
