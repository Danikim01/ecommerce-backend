import passport from "passport";

import productController from "../controller/productController.js";
import cartController from "../controller/cartController.js";
import userController from "../controller/userController.js";

import productModel from "../dao/mongo/models/productModel.js";
import { Router } from 'express';
import auth from "../middlewares/auth.js";
import tokenExpirationMiddleware from "../middlewares/recovery.js"

let pm = new productController();
let cm = new cartController();
let um = new userController();

let router = Router()


router.get("/", (req, res) => {
    res.render(
        "homePage",
        {
            title: "Home page",
            style: "index.css"
        }
    )
})

router.get("/home", passport.authenticate("jwt",{session:false,failureRedirect:"/login"}),async (req, res) => {
    const user = await um.getUser(req.user._id);
    let cart_id = "empty-cart"
    if (user && user.cart.length !== 0) {
        cart_id = user.cart[0].cart._id;
    }
    res.render(
        'home',
        {
            title: 'Home',
            style: 'index.css',
            user: req.user,
            isAdmin: req.user.role === "admin" ? true : false,
            cart_id: cart_id,
        }
    )
})


//Solo el usuario puede enviar mensajes al chat
router.get("/chat", passport.authenticate("jwt", { session: false }), 
auth(['user','admin','premium']),(req, res) => {
    res.render(
        'chat',
        {
            title: 'Chat',
            style: 'index.css',
        }
    )
})


// Solo el administrador puede crear actualizar y eliminar productos
router.get("/realtimeproducts", passport.authenticate("jwt", { session: false }), 
auth(['admin','premium']), async (req, res) => { 
    try{
        res.render(
            "realTimeProducts",
            {
                title: "Productos a tiempo real",
                style: "index.css",
                products: await pm.getAllProducts(),
                email: req.user.email,
            }
        )
    }catch(err){
        res.status(400).send({error: "Error al obtener los productos"})
    }

})

router.get("/carts/:cid", passport.authenticate("jwt",{session:false}),async (req, res) => {
    try {
        if (req.params.cid == "empty-cart") {
            res.render("cart", {
                title: "Carrito",
                style: "index.css",
                isValid: false,
            });
            return
        }
        let products = await cm.getProductsFromCart(req.params.cid);
        let isValid = products.length > 0;
        const user_cart_id = req.user.cart[0] ? req.user.cart[0].cart._id : null;
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
            user_cart_id: user_cart_id,
            payload: transformedProducts 
        });
    } catch (err) {
        res.status(400).send({ error: "Error al obtener el carrito" });
    }
});


router.get("/views/products", passport.authenticate("jwt",{session:false}), async (req, res) => {
    try{
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

        let baseURL = "http://localhost:8080/views/products";

        paginateResult.prevLink = paginateResult.hasPrevPage ? `${baseURL}?page=${paginateResult.prevPage}` : null;
        paginateResult.nextLink = paginateResult.hasNextPage ? `${baseURL}?page=${paginateResult.nextPage}` : null;
        paginateResult.isValid = !(page <= 0 || page > paginateResult.totalPages);
        paginateResult.style = "index.css"

        res.render(
            "index",
            paginateResult
        )
    }catch(err){
        res.status(400).send({error: "Error al obtener los productos"})
    }
})

router.get("/views/products/:pid", passport.authenticate("jwt",{session:false}),async (req,res) => {
    try{
        let productDetails = await pm.getProductByID(req.params.pid)
        if (productDetails instanceof Error) return res.status(400).send({error: productDetails.message})
        productDetails.style = "index.css"
        productDetails.userId = req.user._id
        res.render(
            "product",
            productDetails
        )
    }catch(err){
        res.status(400).send({error: "Error al obtener el carrito"})
    }
})


router.get("/login", (req, res) => {
    res.render(
        'login',
        {
            title: 'Login',
            style: 'index.css',
        }
    )
});

router.get("/register", (req, res) => {
    res.render(
        'register',
        {
            title: 'Register',
            style: 'index.css',
        }
    )
});


router.get("/forgot", (req, res) => {
    res.render(
        'forgot',
        {
            title: 'Restore password',
            style: 'index.css',
        }
    )
})

router.get("/restore",tokenExpirationMiddleware,(req,res)=> {
    let token = req.query.token
    res.render(
        'restore',
        {
            title: 'Restore',
            style: 'index.css',
            token: token
        }
    )
})

// router.get("/api/sessions/current", passport.authenticate("jwt",{session:false}),(req,res) => {
//     res.render(
//         "current",
//         {
//             title: "Current",
//             style: "index.css",
//             curr_user: req.user
//         }
//     )
// })

router.get("/logout", (req, res) => {
    res.clearCookie('auth');
    res.redirect('/login');
})

export default router;