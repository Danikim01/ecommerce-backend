import {Router} from 'express';
import userModel from '../dao/models/userModel.js';
import {createHash, isValidPassword} from '../utils/functionsUtil.js';
import passport from 'passport';

const router = Router();

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


router.post("/register", passport.authenticate("register", { failureRedirect: "/api/sessions/failRegister" }), (req, res) => {
    req.session.failRegister = false;
    res.redirect("/login");
})

router.get("/failRegister", (req, res) => {
    req.session.failRegister = true;
    res.redirect("/register");
})

router.post("/login",passport.authenticate("login", {failureRedirect: "/api/sessions/failLogin"}), (req, res) => {
    req.session.failLogin = false;
    if (!req.user){
        req.session.failLogin = true;
        return res.redirect("/login");
    }
    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
    }
    return res.redirect("/home");
})

router.get("/failLogin", (req, res) => {
    req.session.failLogin = true;
    res.redirect("/login");
})



// router.get("/current",(req,res) => {
//     req.session.user ? res.status(200).send(req.session.user) : res.status(401).send({error: "No user logged in"});
// })

export default router;