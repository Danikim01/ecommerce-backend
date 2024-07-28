import Router from 'express';
import userController from '../controller/userController.js';
import { uploader } from '../utils.js';
import passport from 'passport';
import __dirname from '../path.js';
const um = new userController();


const router = Router();

//router.get("/premium/:uid",um.changeRole);

router.get("/:uid",um.getUser)


const authenticate_current_user = async (req, res, next) => {
    const uid = req.params.uid;
    const current_user = req.user;
    if (current_user._id !== uid) {
        return res.status(401).send("Unauthorized");
    }
    next();
}

//este uid tiene que coincidir con el uid del usuario logeado
router.post("/:uid/documents",
    passport.authenticate("jwt",{session:false,failureRedirect:"/login"}),
    authenticate_current_user,uploader.fields([{ name: 'profile' }, { name: 'product' }, { name: 'documents' }]),
    um.uploadDocuments)
    
router.get("/premium/:uid",passport.authenticate("jwt",{session:false,failureRedirect:"/login"}),um.changeRole);


export default router;