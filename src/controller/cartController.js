import { cartsService } from "../repositories/index.js";

export default class cartController {

    getProductsFromCart(cid){
        return cartsService.getProductsFromCart(cid);
    }

    addCart(){
        return cartsService.addCart();
    }

    addProductToCart(cid,pid){
        return cartsService.addProductToCart(cid,pid);
    }

    deleteProductFromCart(cid,pid){
        return cartsService.deleteProductFromCart(cid,pid);
    }

    updateCart(cid,products){
        return cartsService.updateCart(cid,products);
    }

    updateProductQuantity(cid,pid,new_quantity){
        return cartsService.updateProductQuantity(cid,pid,new_quantity);
    }

    deleteProducts(cid){
        return cartsService.deleteProducts(cid);
    }
}

