import ProductManager from "../productManager.js";
import { Router } from 'express';
import { generateUniqueString } from "../utils/generateId.js";

let pm = new ProductManager();

let router = Router()

router.get("/", async (req,res) => {
    try{
        let limit = req.query.limit
        let products = await pm.getProducts()
        limit ? res.status(200).send(products.slice(0,limit)) : res.status(200).send(products)
    }catch(err){
        res.status(400).send({error: "Error al obtener los productos"})
    }
})

router.get("/:pid", async (req,res) => {
    try{
        let product = await pm.getProductById(req.params.pid)
        res.status(200).send(product)
    }catch(err){
        res.status(400).send({error: "Error al obtener el producto"})
    }
})


router.post("/", async (req,res) => {
    try{
        let product = req.body
        if (!product.title || !product.price || !product.thumbnail || !product.code || !product.stock || !product.description || !product.status || !product.category) return res.status(400).send({error: "Campos de producto incompletos"})
        await pm.addProduct(product,generateUniqueString(8))
        res.status(200).send({message: "Producto agregado correctamente"})
    }catch(err){
        res.status(400).send({error: "Error al agregar el producto"})
    }
})

router.put("/:pid", async (req,res) => {
    try{
        let fields = req.body
        await pm.updateProduct(req.params.pid,fields)
        res.status(200).send({message: "Producto actualizado correctamente"})
    }catch(err){
        res.status(400).send({error: "Error al actualizar el producto"})
    }
})

router.delete("/:pid", async (req,res) => {
    try{
        await pm.deleteProduct(req.params.pid)
        res.status(200).send({message: "Producto eliminado correctamente"})
    }catch(err){
        console.log(err)
        res.status(400).send({error: "Error al eliminar el producto"})
    }
})

export default router;