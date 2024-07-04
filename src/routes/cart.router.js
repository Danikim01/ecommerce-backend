import { Router } from 'express';
import passport from 'passport';
import cartController from '../controller/cartController.js';
import productController from '../controller/productController.js';
import TicketController from '../controller/ticketController.js';
import auth from "../middlewares/auth.js";
let cm = new cartController();
let tc = new TicketController();
let pm = new productController();
let router = Router()


router.post("/",async (req,res) => {
    try{
        let result = await cm.addCart()
        if (result instanceof Error) return res.status(400).send({error: result.message})
        res.status(200).send({message: "Carrito agregado correctamente"})
    }catch(err){
        res.status(400).send({error: "Error al agregar el carrito"})
    }
})


router.get("/:cid/purchase",passport.authenticate("jwt", { session: false }),async (req,res) => {
    try{
        const user_cart =  await cm.getProductsFromCart(req.params.cid)
        const purchaser = req.user.email
        let invalid_products = []
        let ticket = await tc.createTicket(purchaser,user_cart,invalid_products)
        
        //Update the users cart, meaning the users cart will be empty if all products were bought
        //Update for each product bough the stock
        for (let product of user_cart){
            if (product.product.stock >= product.quantity){
                await pm.buyProduct(product.product._id,product.quantity)
                //also the users cart needs to be updated
                await cm.deleteProductFromCart(req.params.cid,product.product._id)
            }
        }

        if (invalid_products.length > 0){
            return res.status(400).send({error: "Error al realizar la compra, productos invalidos",productos: ticket})
        }

        return res.send({message: "Compra realizada correctamente",ticket: ticket})
    }catch(err){
        res.status(400).send({error: "Error al realizar la compra"})
    
    }
})


router.get("/:cid", async (req,res) => {
    try{
        let cid = req.params.cid
        let cart = await cm.getProductsFromCart(cid)
        if (cart instanceof Error) return res.status(400).send({error: cart.message})
        res.status(200).send({products: cart})
    }catch(err){
        res.status(400).send({error: "Error al obtener el carrito"})
    }
})


router.post("/:cid/product/:pid",async (req,res) => {
    try{
        let result = await cm.addProductToCart(req.params.cid,req.params.pid)
        if (result instanceof Error) return res.status(400).send({error: result.message})
        res.status(200).send({message: "Producto agregado al carrito correctamente"})
    }catch(err){
        res.status(400).send({error: "Error al agregar el producto al carrito"})
    }
})

//Solo el usuario puede agregar productos al carrito
router.post("/:uid/product/:pid",passport.authenticate("jwt", { session: false }), 
auth(['user','premium','admin']) ,async (req,res) => {
    try{
        let result = await cm.addProductToUsersCart(req.params.uid,req.params.pid)
        if (result instanceof Error) return res.status(400).send({error: result.message})
        res.status(200).send({message: "Producto agregado al carrito correctamente"})
    }catch(err){
        res.status(400).send({error: "Error al agregar el producto al carrito del usuario"})
    }
})

router.delete("/:cid/product/:pid",async (req,res) => {
    try{
        let result = await cm.deleteProductFromCart(req.params.cid,req.params.pid)
        if (result instanceof Error) return res.status(400).send({error: result.message})
        res.status(200).send({message: "Producto eliminado del carrito correctamente"})
    }catch(err){
        res.status(400).send({error: "Error al eliminar el producto del carrito"})
    }
})


router.put("/:cid",async(req,res) => {
    try{
        let products = req.body
        let result = await cm.updateCart(req.params.cid,products)
        res.status(200).send({message: "Carrito actualizado correctamente"})
    }catch(err){
        res.status(400).send({error: "Error al actualizar el carrito"})
    }
})


router.put("/:cid/products/:pid",async(req,res) => {
    try{
        let new_quantity = req.body.quantity
        let result = await cm.updateProductQuantity(req.params.cid,req.params.pid,new_quantity)
        if (result instanceof Error) return res.status(400).send({error: result.message})
        res.status(200).send({message: "Cantidad del producto actualizado correctamente"})
    }catch(err){
        res.status(400).send({error: "Error al actualizar el carrito"})
    }
})


router.delete("/:cid",async(req,res) => {
    try{
        let result = await cm.deleteProducts(req.params.cid)
        if (result instanceof Error) return res.status(400).send({error: result.message})
        res.status(200).send({message: "Productos del carrito eliminado correctamente"})
    }catch(err){
        res.status(400).send({error: "Error al eliminar productos el carrito"})
    }
})

export default router;