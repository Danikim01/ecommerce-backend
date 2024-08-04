import productController from "./productController.js";
import userController from "./userController.js";
import { usersService,productsService,cartsService } from "../repositories/index.js";
import axios from "axios";
import FormData from "form-data";
import fs from "fs";

let pm = new productController();
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
    const user = await usersService.getUser(req.user._id);
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
            role: req.user.role,
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
                products: await productsService.getAllProducts(),
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
        let products = await cartsService.getProductsFromCart(req.params.cid);
        let isValid = products.length > 0;
        const user = await usersService.getUser(req.user._id);
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
                quantity: item.quantity,
                cart_id: user_cart_id,
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
        let baseURL = "http://localhost:8080/views/products";
        let paginateResult = await pm.paginateProducts(page,query,sort,products_per_page,baseURL);
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
        let productDetails = await productsService.getProductByID(req.params.pid)
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
    let token = req.query.token
    res.render(
        'restore',
        {
            title: 'Restore',
            style: 'index.css',
            token: token
        }
    )
}

const renderLogout = (req, res) => {
    const user_id = req.user._id;
    res.clearCookie('auth');
    usersService.logout(user_id);
    res.redirect('/login');
}   


const renderFiles = (req,res) => {
    res.render(
        "files",
        {
            title: "Upload Files",
            style: "index.css",
            user: req.user,
        }
    )
}


const renderAlerts = async (req,res) => {
    try{
        const response = await axios.get(`http://localhost:8080/api/users/premium/${req.user._id}`,
            {
                headers:{
                    Cookie: `auth=${req.cookies.auth}`
                }
            }
        );
        res.render(
            "alerts",
            {
                title: "Alerts",
                style: "index.css",
                messages: [{message: response.data.status}]
            }
        )
    }catch(err){
        res.render(
            "alerts",
            {
                title: "Alerts",
                style: "index.css",
                messages: [{message: err.response.data.status}]
            }
        )
    }
}

const renderDocs = async (req,res) => {
    try{
        const files = req.files;

        const form_data = new FormData();
        
        for (const field in files){
            files[field].forEach(file => {
                form_data.append(field, fs.createReadStream(file.path), file.originalname);
            });
        }

        const response = await axios.post(`http://localhost:8080/api/users/${req.user._id}/documents`, form_data, {
            headers: {
              ...form_data.getHeaders(),
              Cookie: `auth=${req.cookies.auth}`
            }
        })

        res.render(
            "documents",
            {
                title: "Documents",
                style: "index.css",
                files: response.data.files
            }
        )

    }catch(err){
        console.error(err)
        res.render(
            "alerts",
            {
                title: "Alerts",
                style: "index.css",
                messages: [{message: err.message}]
            }
        )
    }
}

const renderManage = async (req,res) => {
    try{
        const users = await usersService.getAllUsers();
        //filter from the users the admin users, that user should not figure in the users array
        const filtered_users = users.filter(user => user.role !== "admin");
        const isValid = filtered_users.length > 0;
        res.render(
            "manage",
            {
                title: "Manage",
                style: "index.css",
                isValid: isValid,
                users: filtered_users
            }
        )
    }catch(err){
        res.render(
            "alerts",
            {
                title: "Alerts",
                style: "index.css",
                messages: [{message: err.message}]
            }
        )
    }
}



// const renderCurrent = async (req, res) => {
//     res.render(
//         "current",
//         {
//             title: "Current",
//             style: "index.css",
//             curr_user: req.user
//         }
//     )
// }



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
    renderLogout,
    renderFiles,
    renderAlerts,
    renderDocs,
    renderManage,
    //renderCurrent
}