import {Router} from 'express';
import userModel from '../dao/models/userModel.js';
import {createHash, isValidPassword} from '../utils/functionsUtil.js';
import passport from 'passport';

import userController from '../controller/userController.js';

const router = Router();
const sessionService = new userController();

router.post("/restore", passport.authenticate("restore", {failureRedirect: "/api/sessions/failRestore"}), (req, res) => {
    req.session.failRestore = false;
    res.redirect("/login");
})

router.get("/failRestore", (req, res) => {
    req.session.failRestore = true;
    res.redirect("/restore");
})


router.get("/github", passport.authenticate('github', {scope: ['user:email']}), (req, res) => {
    res.send({
        status: 'success',
        message: 'Success'
    });
});

router.get("/githubcallback", passport.authenticate('github', {failureRedirect: '/login'}), (req, res) => {
    req.session.user = req.user;
    return res.redirect('/home');
});


router.post("/register", async (req, res) => {
    try{
        await sessionService.create(req.body);
        res.redirect("/login");
    }catch(error){
        res.redirect("/register");
    }
})

router.get("/failRegister", (req, res) => {
    res.redirect("/register");
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

router.get("/failLogin", (req, res) => {
    res.redirect("/login");
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