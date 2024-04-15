import ProductManagerDB from "../dao/productManagerDB.js";
import productModel from "../dao/models/productModel.js";
import __dirname from "../path.js";
import { Router } from 'express';
import { uploader } from "../utils.js";
let pm = new ProductManagerDB();

let router = Router()

// router.get("/", async (req, res) => {
//     try {
//         let limit = req.query.limit;
//         let products = await pm.getAllProducts();
//         limit ? res.status(200).send(products.slice(0, limit)) : res.status(200).send(products);
//     } catch (err) {
//         res.status(400).send({ error: "Error al obtener los productos" });
//     }
// });

router.get("/", async (req, res) => {
    try {
        let limit = req.query.limit ? parseInt(req.query.limit) : 10;
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let query = req.query.query;
        let sort = req.query.sort;
        if (sort){
            sort = sort === "asc" ? 1 : -1;
        }

        let result = await pm.getAllProducts();

        result = result.slice(0,limit);

        // Aplicar filtro
        if (query) {
            result = result.filter(product => {
                for (let field in product) {
                    if (product[field] == query) {
                        return true;
                    }
                }
                return false;
            });
        }

        // Aplicar ordenamiento
        if (sort !== undefined) {
            result = result.sort((a, b) => {
                if (a.price > b.price) return sort;
                if (a.price < b.price) return -sort;
                return 0;
            });
        }


        let products_per_page = 3

        // Calcular el número total de páginas
        let totalPages = Math.ceil(result.length / products_per_page);

        // Obtener los productos para la página actual
        let startIndex = (page - 1) * products_per_page;
        let endIndex = startIndex + products_per_page;
        let pageItems = result.slice(startIndex, endIndex);

        // Determinar si hay una página previa y siguiente
        let hasPrevPage = page > 1;
        let hasNextPage = page < totalPages;

        //la base URL tiene que tambien contener los parametros que fueron ingresados
        
        let baseURL = "http://localhost:8080/api/products";
        let prevLink = hasPrevPage ? `${baseURL}?page=${page - 1}&limit=${limit}` : null;
        if (query) {
            prevLink += `&query=${query}`;
        }
        if (sort) {
            prevLink += `&sort=${sort}`;
        }

        let nextLink = hasNextPage ? `${baseURL}?page=${page + 1}&limit=${limit}` : null;
        if (query) {
            nextLink += `&query=${query}`;
        }
        if (sort) {
            nextLink += `&sort=${sort}`;
        }
        let isValid = !(page <= 0 || page > result.totalPages);
        
        let response = {
            status: "success",
            payload: pageItems,
            totalPages: totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page: page,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink,
            isValid: isValid,
        };

        res.render(
            "index",
            {
                ...response,
                style: "index.css"
            }
        )
        
        // return res.status(200).send({
        //     ...response,
        //     style: "index.css"
        // });
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
        if (!product.title || !product.price || !product.code || !product.stock || !product.description || !product.category) return res.status(400).send({error: "Campos de producto incompletos"})
        console.log(product)
        await pm.createProduct(product)
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