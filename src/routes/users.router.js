import {Router} from 'express';
import userModel from '../dao/models/userModel.js';
import {createHash, isValidPassword} from '../utils/functionsUtil.js';
import passport from 'passport';

const router = Router();

// router.post("/restore",async (req, res) => {
//     try{
//         req.session.failRestore = false;
//         const user = await userModel.findOne({email: req.body.email});
//         if (!user) {
//             req.session.failRestore = true;
//             return res.redirect("/restore");
//         }
//         const newPassword = createHash(req.body.password);
//         user.password = newPassword;
//         await user.save();
//         res.redirect("/login");
//     }catch(e){
//         console.log(e.message);
//         req.session.failRestore = true;
//         res.redirect("/restore");
//     }
// })

router.post("/restore", passport.authenticate("restore", {failureRedirect: "/api/sessions/failRestore"}), (req, res) => {
    req.session.failRestore = false;
    res.redirect("/login");
})

router.get("/failRestore", (req, res) => {
    req.session.failRestore = true;
    res.redirect("/restore");
})


// router.post("/register",async (req, res) => {
//     try {
//         req.session.failRegister = false;
//         await userModel.create(req.body);
//         res.redirect("/login");
//     } catch (e) {
//         console.log(e.message);
//         req.session.failRegister = true;
//         res.redirect("/register");
//     }
// });


// router.post("/register", async (req, res) => {
//     try {
//         req.session.failRegister = false;

//         if (!req.body.email || !req.body.password) throw new Error("Register error!");

//         //find the user in the database userModel
//         let user = await userModel.findOne({email: req.body.email}).lean();
//         if (user) throw new Error("User already exists!");

//         const newUser = {
//             first_name: req.body.first_name ?? "",
//             last_name: req.body.last_name ?? "",
//             email: req.body.email,
//             age: req.body.age ?? "",
//             password: createHash(req.body.password)
//         }

//         await userModel.create(newUser);
//         res.redirect("/login");
//     } catch (e) {
//         console.log(e.message);
//         req.session.failRegister = true;
//         res.redirect("/register");
//     }
// });


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

// router.post("/login", async (req, res) => {
//     try {
//         req.session.failLogin = false;
//         const result = await userModel.findOne({email: req.body.email});
//         if (!result) {
//             req.session.failLogin = true;
//             return res.redirect("/login");
//         }

//         if (req.body.password !== result.password) {
//             req.session.failLogin = true;
//             return res.redirect("/login");
//         }else{
//             const password = result.password;
//             const email = result.email;
//             if (email ==  "adminCoder@coder.com" && password == "adminCod3r123") {
//                 req.session.admin = true;
//             }else{
//                 req.session.admin = false;
//             }
//             delete result.password;
//             req.session.user = result;
    
//             return res.redirect("/home");
//         }
//     } catch (e) {
//         req.session.failLogin = true;
//         return res.redirect("/login");
//     }
// });

// router.post("/login", async (req, res) => {
//     try {
//         req.session.failLogin = false;
//         const result = await userModel.findOne({email: req.body.email}).lean();
//         if (!result) {
//             req.session.failLogin = true;
//             return res.redirect("/login");
//         }

//         //console.log("Se estan comparando >>>>>>", result.password, req.body.password);
//         if (!isValidPassword(result, req.body.password)) {
//             req.session.failLogin = true;
//             return res.redirect("/login");
//         }

//         delete result.password;
//         req.session.user = result;

//         return res.redirect("/home");
//     } catch (e) {
//         req.session.failLogin = true;
//         return res.redirect("/login");
//     }
// });

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
        age: req.user.age
    }
    return res.redirect("/home");
})

router.get("/failLogin", (req, res) => {
    req.session.failLogin = true;
    res.redirect("/login");
})

export default router;