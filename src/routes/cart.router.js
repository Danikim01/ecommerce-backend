import { Router } from 'express';
import passport from 'passport';
import cartController from '../controller/cartController.js';
import auth from "../middlewares/auth.js";
import config from '../config/config.js';


let cm = new cartController();

let router = Router()
router.post("/",cm.addCart)
router.get('/success', (req, res) => { res.redirect('/static/payment_success.html') })
router.get('/cancel', (req, res) => { res.redirect('/static/payment_cancel.html') })

router.get('/:cart_id/checkoutstr', passport.authenticate("jwt", { session: false }),cm.checkoutStr);

router.get('/:cart_id/checkoutmp', passport.authenticate("jwt", { session: false }), cm.checkoutmp);

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