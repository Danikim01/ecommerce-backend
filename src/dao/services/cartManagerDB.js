import cartModel from '../dao/models/cartModel.js'


export default class cartManagerDB {
    async getProductsFromCart(cart_id){
        try{
            const cart = await cartModel.findOne({_id: cart_id});
            return cart.products;
        }catch(error){
            console.error(error.message);
            throw new Error("Error al buscar los productos del carrito");
        }
    }

    async addCart(){
        try{
            await cartModel.create({products: []});
        }catch(error){
            console.error(error.message);
            throw new Error("Error al agregar el carrito");
        }
    }

    async addProductToCart(cart_id,product_id){
        try{
            const cart = await cartModel.findOne({ _id: cart_id});
            console.log(cart)
            cart.products.push({product: product_id});
            await cartModel.updateOne({_id: cart_id}, cart);
        }catch(error){
            console.error(error.message);
            throw new Error("Error al agregar el producto al carrito");
        }
    }

    async deleteProductFromCart(cid,pid){
        try{
            const cart = await cartModel.findOne({_id: cid});
            cart.products = cart.products.filter(product => product.product._id.toString() != pid);
            await cartModel.updateOne({_id: cid}, cart); 
        }catch(err){
            console.error(err.message);
            throw new Error("Error al eliminar el producto del carrito");
        }
    }

    async actualizarCarrito(cid,products){
        try{
            const cart = await cartModel.findOne({_id: cid});
            cart.products = products;
            await cartModel.updateOne({_id: cid}, cart);
        }catch(err){
            console.error(err.message);
            throw new Error("Error al actualizar el carrito");
        }
    }

    async updateProductQuantity(cid,pid,new_quantity){
        try{
            const cart = await cartModel.findOne({_id: cid});
            const product = cart.products.find(product => product.product._id.toString() === pid);
            product.quantity = new_quantity;
            await cartModel.updateOne({_id: cid}, cart);
        }catch(err){
            console.error(err.message);
            throw new Error("Error al actualizar la cantidad del producto");
        }
    }

    async deleteProducts(cid){
        try{
            const cart = await cartModel.findOne({_id: cid});
            cart.products = [];
            await cartModel.updateOne({_id: cid}, cart);
        }catch(err){
            console.error(err.message);
            throw new Error("Error al eliminar el carrito");
        }
    }
}