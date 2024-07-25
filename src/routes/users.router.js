import {Router} from 'express';
import passport from 'passport';
import userController from '../controller/userController.js';
import check_admin from '../middlewares/admin.js';
import tokenExpirationMiddleware from '../middlewares/recovery.js';
import { uploader } from '../utils.js';

const router = Router();
const uc = new userController();

router.post("/register",check_admin,uc.createUser);
router.post("/login",uc.login)
router.post("/forgot",uc.forgotPassword);
router.post("/restore", tokenExpirationMiddleware,uc.restorePassword);

router.get("/current", passport.authenticate("jwt",{session:false,failureRedirect:"/login"}),(req, res) => {
    req.logger.info("[Current user]: ",req.user);
    res.render(
        "current",
        {
            title: "Current",
            style: "index.css",
            curr_user: req.user
        }
    )
})

router.get("/:uid",uc.getUser)


const authenticate_current_user = async (req, res, next) => {
    const uid = req.params.uid;
    const current_user = req.user;
    if (current_user._id !== uid) {
        return res.status(401).send("Unauthorized");
    }
    next();
}

//este uid tiene que coincidir con el uid del usuario logeado
router.post("/:uid/documents",passport.authenticate("jwt",{session:false,failureRedirect:"/login"}),authenticate_current_user,uploader.array("documents"),uc.uploadDocuments)




export default router;