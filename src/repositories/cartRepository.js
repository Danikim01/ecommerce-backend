//import CartDTO from "../dao/dto/cartDTO";

export default class CartRepository{
    constructor(dao){
        this.dao = dao;
    }

    async getProductsFromCart(cid){
        return await this.dao.getProductsFromCart(cid);
    }

    async addCart(){
        return await this.dao.addCart();
    }

    async addProductToCart(cid,pid){
        return await this.dao.addProductToCart(cid,pid);
    }

    async addProductToUsersCart(uid,pid){
        return await this.dao.addProductToUsersCart(uid,pid);
    }

    async deleteProductFromCart(cid,pid){
        return await this.dao.deleteProductFromCart(cid,pid);
    }

    async updateCart(cid,products){
        return await this.dao.updateCart(cid,products);
    }

    async updateProductQuantity(cid,pid,new_quantity){
        return await this.dao.updateProductQuantity(cid,pid,new_quantity);
    }

    async deleteProducts(cid){
        return await this.dao.deleteProducts(cid);
    }

    async deleteCart(cid){
        return await this.dao.deleteCart(cid);
    }
}