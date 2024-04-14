import ProductManagerDB from "../dao/productManagerDB.js";
import CartManagerDB from "../dao/cartManagerDB.js";
import productModel from "../dao/models/productModel.js";
import { Router } from 'express';

let pm = new ProductManagerDB();
let cm = new CartManagerDB();

let router = Router()

router.get("/chat", (req, res) => {
    res.render(
        'chat',
        {
            title: 'Chat',
            style: 'index.css',
        }
    )
})

router.get("/api/realtimeproducts", async (req, res) => { 
    try{
        res.render(
            "realTimeProducts",
            {
                title: "Productos a tiempo real",
                style: "index.css",
                products: await pm.getAllProducts()
            }
        )
    }catch(err){
        res.status(400).send({error: "Error al obtener los productos"})
    }

})

router.get("/carts/:cid",async (req,res) => {
    try{
        let products = await cm.getProductsFromCart(req.params.cid);
        res.render(
            "cart",
            {
                title: "Carrito",
                style: "index.css",
                products: products
            }
        )
    }catch(err){
        res.status(400).send({error: "Error al obtener el carrito"})
    }
})


export default router;