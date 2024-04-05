import cartModel from './models/cartModel.js'
import mongoose from 'mongoose';

export default class cartManagerDB {
    async getProductsFromCart(cart_id){
        try{
            const cart = await cartModel.findOne({_id: cart_id});
            console.log(cart);
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
            if (!cart) {
                throw new Error(`El carrito ${cart_id} no existe!`);
            }
            const productIndex = cart.products.findIndex(p => p.product.equals(product_id));
            if (productIndex === -1) {
                const new_id = new mongoose.Types.ObjectId()
                cart.products.push({ product: new_id, quantity: 1 });
            } else {
                cart.products[productIndex].quantity++;
            }
            await cart.save();
        }catch(error){
            console.error(error.message);
            throw new Error("Error al agregar el producto al carrito");
        }
    }
}