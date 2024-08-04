import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const tokenExpirationMiddleware = (req, res, next) => {
    const token = req.query.token;
    if (!token) {
        //return res.send("Token not found");
        return res.redirect("/forgot");
    }

    jwt.verify(token, config.email_key, (err, decoded) => {
        if (err) {
            return res.redirect("/forgot");
            //return res.send("Token expired");
        }
        next();
    });
};

export default tokenExpirationMiddleware;