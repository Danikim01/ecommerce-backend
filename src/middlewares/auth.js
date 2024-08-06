import { usersService } from "../repositories/index.js";


const auth = (roles = []) => {
    return async (req, res, next) => {
        const user = await usersService.getUser(req.user._id);
        req.user = user;
        if (!req.user || (roles.length && !roles.includes(req.user.role))) {
            // Usuario no autorizado
            //return res.status(403).send({ message: 'No autorizado' });
            const fullUrl = req.originalUrl;
            const user_info = user.first_name + " " + user.last_name;
            return res.render(
                "auth",
                {
                    title: "No autorizado",
                    style: "index.css",
                    user_info: user_info,
                    url: fullUrl
                }
            )
        }
        // Usuario autorizado
        next();
    }
}



export default auth;