import { get } from "mongoose";
import productManagerDB from "../dao/services/productManagerDB";


export default class productController {
    constructor() {
        this.dao = new productManagerDB();
    }

    getAll(){
        return this.dao.getAllProducts();
    }

    getProductByID(pid){
        return this.dao.getProductByID(pid);
    }

    create(product){
        return this.dao.createProduct(product);
    }

    update(pid, product){
        return this.dao.updateProduct(pid, product);
    }

    delete(pid){
        return this.dao.deleteProduct(pid);
    }
}
