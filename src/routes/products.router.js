//import ProductManager from "../productManager.js";
import ProductManagerDB from "../dao/productManagerDB.js";
import { Router } from 'express';
import { uploader } from "../utils.js";
let pm = new ProductManagerDB();

let router = Router()

router.get("/", async (req, res) => {
    try {
        let limit = req.query.limit;
        let products = await pm.getAllProducts();
        limit ? res.status(200).send(products.slice(0, limit)) : res.status(200).send(products);
    } catch (err) {
        res.status(400).send({ error: "Error al obtener los productos" });
    }
});

router.get("/:pid", async (req,res) => {
    try{
        let product = await pm.getProductByID(req.params.pid)
        if (product instanceof Error) return res.status(400).send({error: product.message})
        res.status(200).send(product)
    }catch(err){
        res.status(400).send({error: "Error al obtener el producto"})
    }
})


router.post("/", uploader.array("thumbnail"), async (req,res) => {
    try{
        //if (req.files.length === 0) return res.status(400).send({error: "Imagen de producto requerida"})
        let product = req.body
        console.log(req.files)
        let paths_array = req.files.map(file => file.path)
        product.thumbnail = paths_array
        if (!product.title || !product.price || !product.code || !product.stock || !product.description || !product.category) return res.status(400).send({error: "Campos de producto incompletos"})
        let result = await pm.createProduct(product)
        if (result instanceof Error) return res.status(400).send({error: result.message})
        return res.status(200).send({message: "Producto agregado correctamente"})
    }catch(err){
        res.status(400).send({error: "Error al agregar el producto"})
    }
})

router.put("/:pid", async (req,res) => {
    try{
        let fields = req.body
        let result = await pm.updateProduct(req.params.pid,fields)
        if (result instanceof Error) return res.status(400).send({error: result.message})
        res.status(200).send({message: "Producto actualizado correctamente"})
    }catch(err){
        res.status(400).send({error: "Error al actualizar el producto"})
    }
})

router.delete("/:pid", async (req,res) => {
    try{
        let result = await pm.deleteProduct(req.params.pid)
        if (result instanceof Error) return res.status(400).send({error: result.message})
        res.status(200).send({message: "Producto eliminado correctamente"})
    }catch(err){
        console.log(err)
        res.status(400).send({error: "Error al eliminar el producto desde el product router"})
    }
})

export default router;