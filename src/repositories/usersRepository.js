import UserDTO from "../dao/dto/userDTO.js";

export default class UserRepository {
    constructor(dao){
        this.dao = dao;
    }

    async getAllUsers(){
        return await this.dao.getAllUsers();
    }

    async createUser(user){
        const userDTO = new UserDTO(user);
        return await this.dao.register(userDTO);
    }

    async login(email, password){
        return await this.dao.login(email, password);
    }

    async getUser(uid){
        return await this.dao.getUser(uid);
    }
}