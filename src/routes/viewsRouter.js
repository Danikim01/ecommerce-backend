import ProductManagerDB from "../dao/productManagerDB.js";
import { Router } from 'express';

let pm = new ProductManagerDB();

let router = Router()

router.get("/", async (req, res) => {
    res.render(
        "index",
        {
            title: "Productos",
            style: "index.css",
            products: await pm.getAllProducts()
        }
    )
})

export default router;