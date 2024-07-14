import { usersService } from "../repositories/index.js";


const auth = (roles = []) => {
    return async (req, res, next) => {
        const user = await usersService.getUser(req.user._id);
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