import { Router } from 'express';
import passport from 'passport';
import cartController from '../controller/cartController.js';
import auth from "../middlewares/auth.js";
import config from '../config/config.js';
import Stripe from 'stripe';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const clientStr = new Stripe(config.stripe_key);
const clientMP = new MercadoPagoConfig({ accessToken: config.mercadopago_key });

let cm = new cartController();

let router = Router()
router.post("/",cm.addCart)
router.get('/success', (req, res) => { res.redirect('/static/payment_success.html') })
router.get('/cancel', (req, res) => { res.redirect('/static/payment_cancel.html') })

router.post('/:cart_id/checkoutstr', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const { cart_id } = req.params;
        const data = {
            line_items: req.body,
            mode: 'payment',
            success_url: `${config.base_url}/api/carts/${cart_id}/purchase`,
            cancel_url: `${config.base_url}/api/carts/cancel`
        };
        const payment = await clientStr.checkout.sessions.create(data);
        res.status(200).send(payment);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/:cart_id/checkoutmp', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const { cart_id } = req.params;
        const data = {
            items: req.body,
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
        res.status(500).send(err.message);
    }
});


router.get("/:cid/purchase",passport.authenticate("jwt", { session: false }),cm.purchaseCart)
router.get("/:cid", cm.getCart)
router.post("/:cid/product/:pid",cm.addProduct)
//Solo el usuario puede agregar productos al carrito
router.post("/:uid/product/:pid",passport.authenticate("jwt", { session: false }), auth(['user','premium','admin']),cm.addProductUserCart)
router.delete("/:cid/product/:pid",cm.deleteProduct)
router.put("/:cid",cm.update)
router.put("/:cid/products/:pid",cm.updateQuantity)
router.delete("/:cid",cm.delete)



export default router;