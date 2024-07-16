import { cartsService,productsService,usersService } from "../repositories/index.js";
import TicketController from "./ticketController.js";

let ticketController = new TicketController();

export default class cartController {

    getProductsFromCart(cid){
        return cartsService.getProductsFromCart(cid);
    }

    async addCart(req,res){
        try{
            let result = await cartsService.addCart()
            if (result instanceof Error) return res.status(400).send({error: result.message})
            res.status(200).send({message: "Carrito agregado correctamente"})
        }catch(err){
            res.status(400).send({error: "Error al agregar el carrito"})
        }
    }

    async purchaseCart(req,res) {
        try{
            const user_cart =  await cartsService.getProductsFromCart(req.params.cid)
            const purchaser = req.user.email
            let invalid_products = []
            let valid_products = []
            let ticket = await ticketController.createTicket(purchaser,user_cart,invalid_products)
            //Update the users cart, meaning the users cart will be empty if all products were bought
            //Update for each product bough the stock
            for (let product of user_cart){
                if (product.product.stock >= product.quantity){
                    valid_products.push(product.product.title)
                    //also the users cart needs to be updated
                    await cartsService.deleteProductFromCart(req.params.cid,product.product._id)
                    await productsService.buyProduct(product.product._id,product.quantity)
                }
            }
            if (invalid_products.length > 0){
                return res.status(400).send({
                    message:"Productos invalidos detectados",
                    productos_invalidos: invalid_products,
                    productos_comprados: valid_products,
                    ticket: ticket,
                })
            }
            return res.send({message: "Compra realizada correctamente",productos_comprados: valid_products,ticket: ticket})
        }catch(err){
            res.status(400).send({error: "Error al realizar la compra"})
        
        }
    }

    async getCart(req,res) {
        try{
            let cid = req.params.cid
            let cart = await cartsService.getProductsFromCart(cid)
            if (cart instanceof Error) return res.status(400).send({error: cart.message})
            return res.status(200).send({products: cart})
        }catch(err){
            res.status(400).send({error: "Error al obtener el carrito"})
        }
    }

    async addProduct (req,res) {
        try{
            let result = await cartsService.addProductToCart(req.params.cid,req.params.pid)
            if (result instanceof Error) return res.status(400).send({error: result.message})
            return res.status(200).send({message: "Producto agregado al carrito correctamente"})
        }catch(err){
            res.status(400).send({error: "Error al agregar el producto al carrito"})
        }
    }

    async addProductUserCart(req,res) {
        try{
            let result = await cartsService.addProductToUsersCart(req.params.uid,req.params.pid)
            if (result instanceof Error) return res.status(400).send({error: result.message})
            res.status(200).send({message: "Producto agregado al carrito correctamente"})
        }catch(err){
            res.status(400).send({error: "Error al agregar el producto al carrito del usuario"})
        }
    }

    async deleteProduct(req,res) {
        try{
            let result = await cartsService.deleteProductFromCart(req.params.cid,req.params.pid)
            if (result instanceof Error) return res.status(400).send({error: result.message})
            res.status(200).send({message: "Producto eliminado del carrito correctamente"})
        }catch(err){
            res.status(400).send({error: "Error al eliminar el producto del carrito"})
        }
    }

    async update(req,res) {
        try{
            let products = req.body
            let result = await cartsService.updateCart(req.params.cid,products)
            if (result instanceof Error) return res.status(400).send({error: result.message})
            res.status(200).send({message: "Carrito actualizado correctamente"})
        }catch(err){
            res.status(400).send({error: "Error al actualizar el carrito"})
        }
    }

    async updateQuantity(req,res) {
        try{
            let new_quantity = req.body.quantity
            let result = await cartsService.updateProductQuantity(req.params.cid,req.params.pid,new_quantity)
            if (result instanceof Error) return res.status(400).send({error: result.message})
            res.status(200).send({message: "Cantidad del producto actualizado correctamente"})
        }catch(err){
            res.status(400).send({error: "Error al actualizar el carrito"})
        }
    }

    async delete(req,res) {
        try{
            let result = await cartsService.deleteProducts(req.params.cid)
            if (result instanceof Error) return res.status(400).send({error: result.message})
            res.status(200).send({message: "Productos del carrito eliminado correctamente"})
        }catch(err){
            res.status(400).send({error: "Error al eliminar productos el carrito"})
        }
    }

    addProductToCart(cid,pid){
        return cartsService.addProductToCart(cid,pid);
    }

    addProductToUsersCart(uid,pid){
        return cartsService.addProductToUsersCart(uid,pid);
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

    deleteCart(cid){
        return cartsService.deleteCart(cid);
    }
}

