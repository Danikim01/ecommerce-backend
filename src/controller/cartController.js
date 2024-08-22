import { cartsService,productsService,usersService } from "../repositories/index.js";
import TicketController from "./ticketController.js";
import config from "../config/config.js";
import Stripe from 'stripe';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const clientStr = new Stripe(config.stripe_key);
const clientMP = new MercadoPagoConfig({ accessToken: config.mercadopago_key });

let ticketController = new TicketController();

export default class cartController {

    getProductsFromCart(cid){
        return cartsService.getProductsFromCart(cid);
    }

    async addCart(req,res){
        try{
            let result = await cartsService.addCart()
            if (result instanceof Error) return res.status(400).send({error: result.message})
            res.status(200).send({message: "Carrito agregado correctamente",payload: result})
        }catch(err){
            res.status(400).send({error: "Error al agregar el carrito"})
        }
    }

    async checkoutStr(req,res){
        try {
            const { cart_id } = req.params;
            const cart_items = await cartsService.getProductsFromCart(cart_id);
            const line_items = []

            for (let item of cart_items) {
                line_items.push({
                    price_data: {
                        product_data: {
                            name: item.product.title
                        },
                        currency: 'usd',
                        unit_amount: item.product.price * 100,
                    },
                    quantity: item.quantity
                });
            }

            const data = {
                line_items: line_items,
                mode: 'payment',
                success_url: `${config.base_url}/api/carts/${cart_id}/purchase`,
                cancel_url: `${config.base_url}/api/carts/cancel`
            };
            const payment = await clientStr.checkout.sessions.create(data);
            res.status(200).send(payment);
        } catch (err) {
            console.error('Error processing Stripe checkout:', err);
            res.status(500).json({ error: err.message }); // Enviar el error como JSON
        }
    }

    async checkoutmp(req,res){
        try {
            const { cart_id } = req.params;
            const cart_items = await cartsService.getProductsFromCart(cart_id);
            const items = []

            for (let item of cart_items) {
                items.push({
                    title: item.product.title,
                    unit_price: item.product.price,
                    quantity: item.quantity,
                    currency_id: 'ARS'
                });
            }

            const data = {
                items: items,
                back_urls: {
                    success: `${config.base_url}/api/carts/${cart_id}/purchase`,
                    failure: `${config.base_url}/api/carts/cancel`
                },
                auto_return: 'approved'
            }
    
            const service = new Preference(clientMP);
            const payment = await service.create({ body: data });
            
            res.status(200).send({ url: payment.sandbox_init_point });
        } catch (err) {
            console.error('Error processing MP checkout:', err);
            res.status(500).json({ error: err.message }); // Enviar el error como JSON
        }
    }

    async purchaseCart(req, res) {
        try {
            const user_cart = await cartsService.getProductsFromCart(req.params.cid);
            const purchaser = req.user.email;
            let invalid_products = [];
            let valid_products = [];
            let ticket = await ticketController.createTicket(purchaser, user_cart, invalid_products);
    
            for (let product of user_cart) {
                if (product.product.stock >= product.quantity) {
                    valid_products.push(product.product.title);
                    await cartsService.deleteProductFromCart(req.params.cid, product.product._id);
                    await productsService.buyProduct(product.product._id, product.quantity);
                } else {
                    if (!invalid_products.includes(product.product.title)) {
                        invalid_products.push(product.product.title);
                    }
                }
            }
    
            return res.render("ticket", {
                title: "Ticket de compra",
                style: "index.css",
                ticket: {
                    code: ticket.code,
                    purchase_datetime: ticket.purchase_datetime,
                    purchaser: ticket.purchaser,
                    amount: ticket.amount,
                },
                productos_comprados: valid_products,
                invalid_products: invalid_products.length > 0 ? invalid_products : null,
            });
        } catch (err) {
            res.status(400).send({ error: "Error al realizar la compra" });
        }
    }
    
    async getCart(req,res) {
        try{
            let cid = req.params.cid
            let cart = await cartsService.getProductsFromCart(cid)
            if (cart instanceof Error) return res.status(400).send({error: cart.message})
            return res.status(200).send({products: cart})
        }catch(err){
            res.status(400).send({error: "Error al obtener el carrito"})
        }
    }

    async addProduct (req,res) {
        try{
            let result = await cartsService.addProductToCart(req.params.cid,req.params.pid)
            if (result instanceof Error) return res.status(400).send({error: result.message})
            return res.status(200).send({message: "Producto agregado al carrito correctamente",payload:result})
        }catch(err){
            res.status(400).send({error: "Error al agregar el producto al carrito"})
        }
    }

    async addProductUserCart(req,res) {
        try{
            let result = await cartsService.addProductToUsersCart(req.params.uid,req.params.pid)
            if (result instanceof Error) return res.status(400).send({error: result.message})
            res.status(200).send({message: "Producto agregado al carrito correctamente",payload:result})
        }catch(err){
            res.status(400).send({error: "Error al agregar el producto al carrito del usuario"})
        }
    }

    async deleteProduct(req,res) {
        try{
            let result = await cartsService.deleteProductFromCart(req.params.cid,req.params.pid)
            if (result instanceof Error) return res.status(400).send({error: result.message})
            res.status(200).send({message: "Producto eliminado del carrito correctamente",payload:result})
        }catch(err){
            res.status(400).send({error: "Error al eliminar el producto del carrito"})
        }
    }

    async update(req,res) {
        try{
            let products = req.body
            let result = await cartsService.updateCart(req.params.cid,products)
            if (result instanceof Error) return res.status(400).send({error: result.message})
            res.status(200).send({message: "Carrito actualizado correctamente",payload:result})
        }catch(err){
            res.status(400).send({error: "Error al actualizar el carrito"})
        }
    }

    async updateQuantity(req,res) {
        try{
            let new_quantity = req.body.quantity
            let result = await cartsService.updateProductQuantity(req.params.cid,req.params.pid,new_quantity)
            if (result instanceof Error) return res.status(400).send({error: result.message})
            res.status(200).send({message: "Cantidad del producto actualizado correctamente",payload:result})
        }catch(err){
            res.status(400).send({error: "Error al actualizar el carrito"})
        }
    }

    async delete(req,res) {
        try{
            let result = await cartsService.deleteProducts(req.params.cid)
            if (result instanceof Error) return res.status(400).send({error: result.message})
            res.status(200).send({message: "Productos del carrito eliminado correctamente",payload:result})
        }catch(err){
            res.status(400).send({error: "Error al eliminar productos el carrito"})
        }
    }
}

