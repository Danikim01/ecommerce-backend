import Router from 'express';
import userController from '../controller/userController.js';
import { uploader } from '../utils.js';
import passport from 'passport';

const um = new userController();


const router = Router();

router.get("/premium/:uid",async (req, res) => {
    try{
        const user = await um.getUser(req.params.uid);
        if (user.role == "admin"){
            return res.status(400).send({status: "No se puede cambiar el rol de un administrador"});
        }
        await um.changeRole(req.params.uid);
        //const user = await um.getUser(req.params.uid);
        res.send({status: "Rol cambiado con éxito"});
    }catch(err){
        console.error(err)
        res.status(400).send({error: "Error al cambiar el rol"})
    }
    
    
});

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

export default router;