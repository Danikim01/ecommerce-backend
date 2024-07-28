import { usersService } from "../repositories/index.js"; 
import jwt from 'jsonwebtoken';
import transport from "../utils/transport.js";


export default class userController {
    async getAllUsers(){
        return await usersService.getAllUsers();
    }

    async createUser(req, res) {
        try{
            await usersService.createUser(req.body);
            res.redirect("/login");
        }catch(error){
            res.redirect("/register");
        }
    }

    async login (req, res) {
        try{
            const token = await usersService.login(req.body.email, req.body.password);
            res.cookie("auth",token,{maxAge: 60*60*1000});
            res.redirect("/home");
        }catch(error){
            res.redirect("/login");
        }
    }

    async forgotPassword(req,res) {
        try{
            const flag = await usersService.getUserByEmail(req.body.email);
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
                                <p>This Link will expire in 1 hour</p>
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
    }

    async getUser(req, res) {
        try{
            const user = await usersService.getUser(req.params.uid);
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
    }

    async changeRole(req, res) {
        try{
            const user = await usersService.getUser(req.params.uid);
            if (user.role == "admin"){
                return res.status(400).send({status: "No se puede cambiar el rol de un administrador"});
            }
            await usersService.changeRole(req.params.uid);
            res.status(200).send({status: "Rol cambiado con éxito"});
        }catch(err){
            res.status(400).send({status: err.message})
        }
    }

    async getUserByEmail(email){
        return await usersService.getUserByEmail(email);
    }


    async restorePassword(req, res) {
        //code to restore password
        try{
            const result = await usersService.restorePassword(req.body.email,req.body.password);
            res.send({status: "Password restored",user: result});
        }catch(err){
            console.error(err);
            res.redirect("/forgot");
        }
    }

    async uploadDocuments(req, res) {
        try {
            const files = req.files;    
 
            if (!files.profile && !files.product && !files.documents) {
                return res.status(400).send({ status: "error", message: "Debe subir al menos un archivo en uno de los campos: profile, product, documents." });
            }
    
            // Combinar todos los archivos subidos en un solo arreglo
            const allFiles = [];
            if (files.profile) allFiles.push(...files.profile);
            if (files.product) allFiles.push(...files.product);
            if (files.documents) allFiles.push(...files.documents);
    
            const result = await usersService.uploadDocuments(req.params.uid, allFiles);
            res.send({ status: "success", files: allFiles });
        } catch (err) {
            console.error(err);
            res.status(400).send({ status: "error", message: err.message });
        }
    }

}
