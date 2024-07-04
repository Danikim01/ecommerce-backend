import Router from 'express';
import userController from '../controller/userController.js';


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

export default router;