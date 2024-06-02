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

    deleteProduct(pid){
        return productsService.deleteProduct(pid);
    }
}
