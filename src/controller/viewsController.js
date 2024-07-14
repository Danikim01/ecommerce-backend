import productController from "./productController.js";
import cartController from "./cartController.js";
import userController from "./userController.js";


let pm = new productController();
let cm = new cartController();
let um = new userController();

const renderHomePage = (req, res) => {
    res.render(
        "homePage",
        {
            title: "Home page",
            style: "index.css"
        }
    )
}

const renderHome = async (req, res) => {
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
}

const renderChat = (req, res) => {
    res.render(
        'chat',
        {
            title: 'Chat',
            style: 'index.css',
        }
    )
}

const renderRealTimeProducts = async (req, res) => {
    try {
        res.render(
            "realTimeProducts",
            {
                title: "Productos a tiempo real",
                style: "index.css",
                products: await pm.getAllProducts(),
                email: req.user.email,
            }
        )
    } catch (err) {
        res.status(400).send({ error: "Error al obtener los productos" })
    }
}

const renderUserCart = async (req, res) => {
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
        const user = await um.getUser(req.user._id);
        const user_cart_id = user.cart[0] ? user.cart[0].cart._id : null;
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
        res.status(400).send({ error: "[views router] Error al obtener el carrito" });
    }
}

const renderProducts = async (req, res) => {
    try{
        let limit = parseInt(req.query.limit) || 10;
        let page = parseInt(req.query.page) || 1;
        let query = req.query.query;
        let sort = req.query.sort === "asc" ? 1 : req.query.sort === "desc" ? -1 : undefined;
        let products_per_page = 3;
        let paginateResult = await pm.paginateProducts(page,query,sort,products_per_page);
        res.render(
            "index",
            paginateResult
        )
    }catch(err){
        res.status(400).send({error: "Error al obtener los productos"})
    }
}

const renderProductDetails = async (req,res) => {
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
}

const renderLogin = (req, res) => {
    res.render(
        'login',
        {
            title: 'Login',
            style: 'index.css',
        }
    )
}

const renderRegister = (req, res) => {
    res.render(
        'register',
        {
            title: 'Register',
            style: 'index.css',
        }
    )
}

const renderForgot = (req, res) => {
    res.render(
        'forgot',
        {
            title: 'Restore password',
            style: 'index.css',
        }
    )
}

const renderRestore = (req, res) => {
    res.render(
        'restore',
        {
            title: 'Restore password',
            style: 'index.css',
        }
    )
}

const renderLogout = (req, res) => {
    res.clearCookie('auth');
    res.redirect('/login');
}   

export default {
    renderHomePage,
    renderHome,
    renderChat,
    renderRealTimeProducts,
    renderUserCart,
    renderProducts,
    renderProductDetails,
    renderLogin,
    renderRegister,
    renderForgot,
    renderRestore,
    renderLogout
}