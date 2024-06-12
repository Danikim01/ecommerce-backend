//import ProductManagerDB from "../services/productManagerDB.js";
import ProductController from "../controller/productController.js";
import productModel from "../dao/mongo/models/productModel.js";
import __dirname from "../path.js";
import { Router } from 'express';
import { uploader } from "../utils.js";

import { generateProductErrorInfo } from "../errors/info.js";
import CustomError from "../errors/CustomError.js";
import { ErrorCodes } from "../errors/enums.js";

let pm = new ProductController();

let router = Router()

router.get("/", async (req, res) => {
    try {
        let limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;
        let query = req.query.query;
        let sort = req.query.sort === "asc" ? 1 : req.query.sort === "desc" ? -1 : undefined;
        let filter = {};

        let products_per_page = 3;
        if (query) {
            if (!isNaN(query)) {
                filter.$or = [{ price: parseInt(query) }, { stock: parseInt(query) }];
            } else {
                filter.$or = [{ title: query }, { code: query }, { category: query }];
            }
        }

        let options = { page, limit:products_per_page, lean: true };

        if (sort !== undefined) {
            options.sort = { price: sort };
        }

        let paginateResult = await productModel.paginate(filter, options);

        let baseURL = "http://localhost:8080/api/products";
        paginateResult.prevLink = paginateResult.hasPrevPage ? `${baseURL}?page=${paginateResult.prevPage}` : null;
        paginateResult.nextLink = paginateResult.hasNextPage ? `${baseURL}?page=${paginateResult.nextPage}` : null;
        paginateResult.isValid = !(page <= 0 || page > paginateResult.totalPages);

        return res.status(200).send(paginateResult);
      
    } catch (err) {
        return res.status(400).send({ error: "Error al obtener los productos" });
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
        let product = req.body
        if (!req.files || req.files.length === 0){
            product.thumbail = []
        }else{
            let paths_array = req.files.map(file => file.path)
            product.thumbnail = paths_array
        }
        if (!product.title || !product.price || !product.code || !product.stock || !product.description || !product.category){
            CustomError.createError(
                {
                    name: "ProductError",
                    cause: generateProductErrorInfo(product),
                    meessage: "Campos de producto incompletos",
                    code: ErrorCodes.ADD_PRODUCT_ERROR
                }
            ) 
            return res.status(400).send({error: "Campos de producto incompletos"})
        }
        console.log(product)
        await pm.create(product)
        return res.status(200).send({message: "Producto agregado correctamente"})
    }catch(err){
        res.status(400).send({error: "Error al agregar el producto"})
    }
})

router.put("/:pid", async (req,res) => {
    try{
        let fields = req.body
        let result = await pm.update(req.params.pid,fields)
        if (result instanceof Error) return res.status(400).send({error: result.message})
        res.status(200).send({message: "Producto actualizado correctamente"})
    }catch(err){
        res.status(400).send({error: "Error al actualizar el producto"})
    }
})

router.delete("/:pid", async (req,res) => {
    try{
        let result = await pm.delete(req.params.pid)
        if (result instanceof Error) return res.status(400).send({error: result.message})
        res.status(200).send({message: "Producto eliminado correctamente"})
    }catch(err){
        console.log(err)
        res.status(400).send({error: "Error al eliminar el producto desde el product router"})
    }
})

export default router;