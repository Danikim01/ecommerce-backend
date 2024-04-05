import { Router } from 'express';
import CartManagerDB from '../dao/cartManagerDB.js';
let cm = new CartManagerDB();
import mongoose from 'mongoose';

let router = Router()

router.get("/:cart_id", async (req,res) => {
    try{
        const c_id = new mongoose.Types.ObjectId(req.params.cart_id);
        let cart = await cm.getProductsFromCart(c_id)
        if (cart instanceof Error) return res.status(400).send({error: cart.message})
        res.status(200).send({products: cart})
    }catch(err){
        res.status(400).send({error: "Error al obtener el carrito"})
    }
})

router.post("/",async (req,res) => {
    try{
        let result = await cm.addCart()
        if (result instanceof Error) return res.status(400).send({error: result.message})
        res.status(200).send({message: "Carrito agregado correctamente"})
    }catch(err){
        res.status(400).send({error: "Error al agregar el carrito"})
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

export default router;