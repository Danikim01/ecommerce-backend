import bcrypt from 'bcrypt';
import moment from 'moment';
import jwt from "jsonwebtoken";

const PRIVATE_KEY = "CoderKeySecretShhh"

export const generateToken = (user) => {
    const token = jwt.sign(
        { user },
        PRIVATE_KEY,
        { expiresIn: "1h" }
    );

    return token;
}

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(403).send({
            error: "Unauthorized"
        });
    }

    const token = authHeader.split(" ")[1]; //Remove string "Bearer"
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) {
            return res.status(403).send(
                {
                    error: "Not authenticated"
                }
            )
        }

        req.user = credentials.user;
        next();
    });
}


export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

export const isValidPassword = (user, password) => {
    console.log("comparing: ", password, user.password)
    return bcrypt.compareSync(password, user.password);
}

export const generateRandomStringCode = () => {
    return Math.random().toString(36).substring(7);
}

export const generateTimeStamp = () => {
    return moment().format('YYYY-MM-DD HH:mm:ss');
}