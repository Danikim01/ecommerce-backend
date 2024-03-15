import {Router} from "express";
import ProductManager from "../productManager.js";
const router = Router();
let pm = new ProductManager();
router.get("/", async (req, res) => {
    res.render("index",
    {
        products:await pm.getProducts(),
        title:"Productos",
        style:"index.css"
    })
})
export default router;