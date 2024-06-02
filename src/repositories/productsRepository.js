import ProductDTO from "../dao/dto/productDTO.js";

export default class ProductRepository{
    constructor(dao){
        this.dao = dao;
    }

    async getAllProducts(){
        return await this.dao.getAllProducts();
    }

    async getProductByID(id){
        return await this.dao.getProductByID(id);
    }

    async createProduct(product){
        const productDTO = new ProductDTO(product);
        return await this.dao.createProduct(productDTO);
    }

    async updateProduct(id, product){
        const productDTO = new ProductDTO(product);
        return await this.dao.updateProduct(id, productDTO);
    }

    async deleteProduct(id){
        return await this.dao.deleteProduct(id);
    }
}