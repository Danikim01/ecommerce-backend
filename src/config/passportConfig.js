import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';
import jwt, { ExtractJwt } from 'passport-jwt';

import userModel from '../dao/models/userModel.js';
import {createHash, isValidPassword} from '../utils/functionsUtil.js';
const JWTStratergy = jwt.Strategy;
const initializatePassport = () => {

    const CLIENT_ID = "Iv1.7db51b4a30ae7971"
    const SECRET_ID = "a6d1dd0c9159d5dcff598ff5128ea2fe19629deb"

    passport.use(
        'github',
        new GitHubStrategy({
            clientID: CLIENT_ID,
            clientSecret: SECRET_ID,
            callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await userModel.findOne({email: profile._json.email})
            if(!user) {
                console.log("El user no existe!")
                const newUser = {
                    first_name: profile.displayName.split(" ")[0] ?? profile._json.login,
                    last_name: profile.displayName.split(" ")[1] ?? profile.displayName.split(" ")[0],
                    email: profile._json.email,
                }
                let result = await userModel.create(newUser);
                done(null, result);
            } else {
                console.log("El user ya existe!")
                console.log("Email:",user.email)
                done(null, user);
            }
        } catch(error) {
            return done(null,false);
        }
    }));

    passport.use(
        'jwt',
        new JWTStratergy(
            {
                jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
                secretOrKey: 'coderSecret'
            },
            async (jwt_payload, done) => {
                try {
                    return done(null, jwt_payload);
                } catch (err) {
                    return done(err);
                }
            }
        )
    )

}

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.auth ?? null;
    }

    return token;
}

export default initializatePassport;