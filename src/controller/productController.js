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

    deleteProduct(pid){
        return productsService.deleteProduct(pid);
    }

    buyProduct(pid, quantity){
        return productsService.buyProduct(pid, quantity);
    }

    updateProduct(pid, product){
        return productsService.updateProduct(pid, product);
    }

    paginateProducts(page,query,sort,products_per_page){
        let filter = {};
        if (query) {
            if (!isNaN(query)) {
                filter.$or = [{ price: parseInt(query) }, { stock: parseInt(query) }];
            } else {
                filter.$or = [{ title: query }, { code: query }, { category: query }];
            }
        }
        let options = { page, limit:products_per_page, lean: true };
        if (sort !== undefined) {
            options.sort = { price: sort };
        }
        return productsService.paginateProducts(filter, options);
    }
}
