import passport from "passport";
import viewsController from "../controller/viewsController.js";
import { Router } from 'express';
import auth from "../middlewares/auth.js";
import tokenExpirationMiddleware from "../middlewares/recovery.js"
import { uploader } from "../utils.js";

let router = Router()

router.get("/", viewsController.renderHomePage)
router.get("/home", passport.authenticate("jwt",{session:false,failureRedirect:"/login"}),viewsController.renderHome)
router.get("/chat", passport.authenticate("jwt", { session: false }), auth(['user','admin','premium']),viewsController.renderChat)
// Solo el administrador puede crear actualizar y eliminar productos
router.get("/realtimeproducts", passport.authenticate("jwt", { session: false }),auth(['admin','premium']), viewsController.renderRealTimeProducts)
router.get("/carts/:cid", passport.authenticate("jwt",{session:false}),viewsController.renderUserCart);
router.get("/views/products", passport.authenticate("jwt",{session:false}),viewsController.renderProducts)
router.get("/views/products/:pid", passport.authenticate("jwt",{session:false}),viewsController.renderProductDetails)
router.get("/login", viewsController.renderLogin);
router.get("/register", viewsController.renderRegister);
router.get("/forgot", viewsController.renderForgot);
router.get("/restore",tokenExpirationMiddleware,viewsController.renderRestore);
router.get("/logout",  passport.authenticate("jwt",{session:false}),viewsController.renderLogout);
//router.get("/api/sessions/current", passport.authenticate("jwt",{session:false,failureRedirect:"/login"}),viewsController.renderCurrent);
router.get("/files", passport.authenticate("jwt",{session:false,failureRedirect:"/login"}),viewsController.renderFiles);
router.get("/alerts", passport.authenticate("jwt",{session:false,failureRedirect:"/login"}),viewsController.renderAlerts);



router.post("/docs", passport.authenticate("jwt",{session:false,failureRedirect:"/login"}),uploader.fields([{ name: 'profile' }, { name: 'product' }, { name: 'documents' }]),viewsController.renderDocs);

export default router;