import cartModel from '../models/cartModel.js';
import userModel from '../models/userModel.js';

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
            cart.products.push({product: product_id});
            await cartModel.updateOne({_id: cart_id}, cart);
        }catch(error){
            console.error(error.message);
            throw new Error("Error al agregar el producto al carrito");
        }
    }

    async addProductToUsersCart(user_id, product_id) {
        try {
            const user = await userModel.findOne({ _id: user_id })
            if (user.cart.length == 0) {
                let new_cart = await cartModel.create({ products: [] })
                user.cart.push({cart: new_cart._id})
                await userModel.updateOne({ _id: user_id }, user)
                const cart = user.cart[0].cart
                await this.addProductToCart(cart._id, product_id)
            }else{
                const cart = user.cart[0].cart
                const products = await this.getProductsFromCart(cart._id)
                const product = products.find(product => product.product._id.toString() === product_id)
                if (product) {
                    product.quantity += 1
                    await this.updateProductQuantity(cart._id, product_id, product.quantity)
                } else {
                    await this.addProductToCart(cart._id, product_id)
                }
            }

        } catch (error) {
            console.error(error.message);
            throw new Error("Error al agregar el producto al carrito del usuario");
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

    async updateCart(cid,products){
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