import userController from "../controller/userController.js";

const um = new userController();


const auth = (roles = []) => {
    return async (req, res, next) => {
        const user = await um.getUser(req.user._id);
        req.user = user;
        if (!req.user || (roles.length && !roles.includes(req.user.role))) {
            // Usuario no autorizado
            return res.status(403).send({ message: 'No autorizado' });
        }
        // Usuario autorizado
        next();
    }
}



export default auth;