//import ProductManagerDB from "../services/productManagerDB.js";
import ProductController from "../controller/productController.js";
import __dirname from "../path.js";
import { Router } from 'express';
import { uploader } from "../utils.js";

let pm = new ProductController();

let router = Router()

router.get("/", pm.getProducts);
router.get("/:pid",pm.getProduct)
router.post("/", uploader.array("thumbnail"),pm.uploadProducts)
router.put("/:pid",pm.update)
router.delete("/:pid", pm.delete)

export default router;