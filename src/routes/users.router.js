import {Router} from 'express';
import passport from 'passport';
import nodemailer from 'nodemailer';
import config from "../config/config.js"
import jwt from "jsonwebtoken";


import userController from '../controller/userController.js';
import check_admin from '../middlewares/admin.js';
import tokenExpirationMiddleware from '../middlewares/recovery.js';

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

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    secure: false,  // true para 465, false para otros puertos
    auth: {
        user: config.email_sender,
        pass: config.email_pass
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    } 
});

router.post("/forgot",async(req,res)=> {
    try{
        const flag = await sessionService.getUserByEmail(req.body.email);
        if (flag) {
            let token = jwt.sign({ token: "forgot_email_token" },"EmailSecretKey",{expiresIn: "1h"});
            //res.cookie("forgot_email_cookie",token,{maxAge: 5*60*1000});
            const result = await transport.sendMail({
                from: 'noreply <danikim01lol@gmail.com>',
                to: req.body.email,
                subject: 'Password recovery email',
                html: ` <div>
                            <h1>Click this Link to recover you email!</h1>
                            <a href="http://localhost:8080/restore?token=${token}">Click here</a>
                            <p>This Link will expire in 5 minutes</p>
                        </div>`
            });
            res.send({status: 'Email sent with success, please check your email!',payload: result, token_generated: token});
        }else{
            res.send("Email not found");
        }
        
    }catch(err){
        console.error(err);
        res.redirect("/forgot");
    }
})


router.post("/restore", tokenExpirationMiddleware, async (req, res) => {
    //code to restore password
    try{
        const result = await sessionService.restorePassword(req.body.email,req.body.password);
        res.send({status: "Password restored",user: result});
    }catch(err){
        console.error(err);
        res.redirect("/forgot");
    }
});


router.get("/current", passport.authenticate("jwt",{session:false,failureRedirect:"/login"}),(req, res) => {
    console.log("[current user]: ",req.user);
    res.render(
        "current",
        {
            title: "Current",
            style: "index.css",
            curr_user: req.user
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