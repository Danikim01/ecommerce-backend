import userManagerDB from "../dao/services/userManagerDB.js";

export default class userController {
    constructor() {
        this.dao = new userManagerDB();
    }

    async getAll(){
        return await this.dao.getAllUsers();
    }

    async create(user){
        return await this.dao.register(user);
    }

    async login(email, password){
        return await this.dao.login(email, password);
    }

    async getUser(uid){
        return await this.dao.getUser(uid);
    }

}
