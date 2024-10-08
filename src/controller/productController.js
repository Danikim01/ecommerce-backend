import { productsService } from "../repositories/index.js";
import CustomError from "../errors/CustomError.js";
import { ErrorCodes } from "../errors/enums.js";
import { generateProductErrorInfo } from "../errors/info.js";
import config from "../config/config.js";

export default class productController {

    async delete(req,res) {
        try{
            let result = await productsService.deleteProduct(req.params.pid)
            if (result instanceof Error) return res.status(400).send({error: result.message})
            res.status(200).send({message: "Producto eliminado correctamente",result})
        }catch(err){
            res.status(400).send({error: "Error al eliminar el producto desde el product router"})
        }
    }

    buyProduct(pid, quantity){
        return productsService.buyProduct(pid, quantity);
    }

    async update(req,res) {
        try{
            let fields = req.body
            let result = await productsService.updateProduct(req.params.pid,fields)
            if (result instanceof Error) return res.status(400).send({error: result.message})
            res.status(200).send({message: "Producto actualizado correctamente"})
        }catch(err){
            res.status(400).send({error: "Error al actualizar el producto"})
        }
    }

    async uploadProducts(req,res) {
        try{
            let product = req.body
            if (req.file) {
                const complete_path = req.file.path;
                const path = complete_path.split("public")[1];
                product.image = path;
            } else {
                product.image = "No image";  // Si no se sube una imagen, dejamos el campo vacío o le damos un valor por defecto
            }

            if (!product.title || !product.price || !product.code || !product.stock || !product.description || !product.category || !product.owner) {
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
            await productsService.createProduct(product)
            return res.render(
                "alerts",
                {
                    title: "alerts",
                    style: "index.css",
                    messages: [{message: "Producto subido con éxito"}]
                }
            )
        }catch(err){
            res.status(400).send({error: err.message})
        }
    }

    async getProduct(req,res){
        try{
            let product = await productsService.getProductByID(req.params.pid)
            if (product instanceof Error) return res.status(400).send({error: product.message})
            res.status(200).send(product)
        }catch(err){
            res.status(400).send({error: "Error al obtener el producto"})
        }
    }

    async getProducts(req, res) {
        try {
            let limit = parseInt(req.query.limit) || 10;
            let page = parseInt(req.query.page) || 1;
            let query = req.query.query;
            let sort = req.query.sort === "asc" ? 1 : req.query.sort === "desc" ? -1 : undefined;
            let baseURL = `${config.base_url}/api/products`;

            let products_per_page = 3;
            let filter = {};
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
            let paginateResult = await productsService.paginateProducts(filter, options,baseURL);
    
            return res.status(200).send(paginateResult);
          
        } catch (err) {
            return res.status(400).send({ error: "Error al obtener los productos" });
        }
    }
    

    async paginateProducts(page,query,sort,products_per_page,baseURL){
        let filter = {};
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
        return await productsService.paginateProducts(filter, options,baseURL);
    }
}
