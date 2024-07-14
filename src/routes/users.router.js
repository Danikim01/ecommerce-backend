import {Router} from 'express';
import passport from 'passport';
import userController from '../controller/userController.js';
import check_admin from '../middlewares/admin.js';
import tokenExpirationMiddleware from '../middlewares/recovery.js';

const router = Router();
const uc = new userController();

router.post("/register",check_admin,uc.createUser);
router.post("/login",uc.login)
router.post("/forgot",uc.forgotPassword);
router.post("/restore", tokenExpirationMiddleware,uc.restorePassword);

router.get("/:uid",uc.getUser)

// router.get("/current", passport.authenticate("jwt",{session:false,failureRedirect:"/login"}),(req, res) => {
//     req.logger.info("[Current user]: ",req.user);
//     res.render(
//         "current",
//         {
//             title: "Current",
//             style: "index.css",
//             curr_user: req.user
//         }
//     )
// })



export default router;