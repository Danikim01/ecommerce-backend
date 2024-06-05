import { productsService } from "../repositories/index.js";

export default class productController {

    getAllProducts(){
        return productsService.getAllProducts();
    }

    getProductByID(pid){
        return productsService.getProductByID(pid);
    }

    createProduct(product){
        return productsService.createProduct(product);
    }

    deleteProduct(pid, product){
        return productsService.deleteProduct(pid, product);
    }

    buyProduct(pid, quantity){
        return productsService.buyProduct(pid, quantity);
    }

    updateProduct(pid, product){
        return productsService.updateProduct(pid, product);
    }
}
