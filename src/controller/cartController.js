import cartManagerDB from "../dao/services/cartManagerDB.js";

export default class cartController {
    constructor() {
        this.dao = new cartManagerDB();
    }

    getProductsFromCart(cid){
        return this.dao.getProductsFromCart(cid);
    }

    addCart(){
        return this.dao.addCart();
    }

    addProductToCart(cid,pid){
        return this.dao.addProductToCart(cid,pid);
    }

    deleteProductFromCart(cid,pid){
        return this.dao.deleteProductFromCart(cid,pid);
    }

    updateCart(cid,products){
        return this.dao.actualizarCarrito(cid,products);
    }

    updateProductQuantity(cid,pid,new_quantity){
        return this.dao.updateProductQuantity(cid,pid,new_quantity);
    }

    deleteProducts(cid){
        return this.dao.deleteProducts(cid);
    }
}

