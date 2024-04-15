import ProductManagerDB from "../dao/productManagerDB.js";
import CartManagerDB from "../dao/cartManagerDB.js";
import productModel from "../dao/models/productModel.js";
import axios from "axios";
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

router.get("/carts/:cid", async (req, res) => {
    try {
        let products = await cm.getProductsFromCart(req.params.cid);
        let isValid = products.length > 0;
        let transformedProducts = products.map(item => {
            return {
                _id: item.product._id,
                title: item.product.title,
                description: item.product.description,
                code: item.product.code,
                price: item.product.price,
                status: item.product.status,
                stock: item.product.stock,
                category: item.product.category,
                thumbnails: item.product.thumbnails,
                quantity: item.quantity 
            };
        });
        res.render("cart", {
            title: "Carrito",
            style: "index.css",
            isValid: isValid,
            payload: transformedProducts 
        });
    } catch (err) {
        res.status(400).send({ error: "Error al obtener el carrito" });
    }
});


router.get("/api/views/products/:cid",async (req,res) => {
    try{
        let productDetails = await pm.getProductByID(req.params.cid)
        if (productDetails instanceof Error) return res.status(400).send({error: productDetails.message})
        console.log(productDetails)
        productDetails.style = "index.css"
        res.render(
            "product",
            productDetails
        )
    }catch(err){
        res.status(400).send({error: "Error al obtener el carrito"})
    }
})
export default router;