import UserDTO from "../dao/dto/userDTO.js";

export default class UserRepository {
    constructor(dao){
        this.dao = dao;
    }

    async getAllUsers(){
        return await this.dao.getAllUsers();
    }

    async getUserByEmail(email){
        return await this.dao.getUserByEmail(email);
    }

    async restorePassword(email, new_password){
        return await this.dao.restorePassword(email, new_password);
    } 

    async createUser(user){
        const userDTO = new UserDTO(user);
        return await this.dao.register(userDTO);
    }

    async changeRole(uid){
        return await this.dao.changeRole(uid);
    }

    async login(email, password){
        return await this.dao.login(email, password);
    }

    async getUser(uid){
        return await this.dao.getUser(uid);
    }

    async logout(uid){
        return await this.dao.logout(uid);
    }

    async deleteUserByEmail(email){
        return await this.dao.deleteUserByEmail(email);
    }

}