import {Router} from 'express';
import passport from 'passport';

import userController from '../controller/userController.js';
import check_admin from '../middlewares/admin.js';

const router = Router();
const sessionService = new userController();


router.post("/register",check_admin,async (req, res) => {
    try{
        await sessionService.createUser(req.body);
        res.redirect("/login");
    }catch(error){
        res.redirect("/register");
    }
})

router.post("/login",async (req, res) => {
    try{
        const token = await sessionService.login(req.body.email, req.body.password);
        res.cookie("auth",token,{maxAge: 60*60*1000});
        res.redirect("/home");
    }catch(error){
        res.redirect("/login");
    }
})


router.get("/current", passport.authenticate("jwt",{session:false,failureRedirect:"/login"}),(req, res) => {
    res.send(
        {
            payload: req.user
        }
    )
})

router.get("/:uid",async (req, res) => {
    try{
        const user = await sessionService.getUser(req.params.uid);
        res.send(
            {
                status: "success",
                payload: user
            }
        )
    }catch(error){
        res.status(400).send(
            {
                status: "error",
                message: error.message
            }
        )
    }
})

export default router;