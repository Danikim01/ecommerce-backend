import { Router } from 'express';
import CartManagerDB from '../dao/cartManagerDB.js';
let cm = new CartManagerDB();
import mongoose from 'mongoose';

let router = Router()

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
        let result = await cm.actualizarCarrito(req.params.cid,products)
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