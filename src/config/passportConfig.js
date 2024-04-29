import passport from 'passport';
import local from 'passport-local';
import GitHubStrategy from 'passport-github2';

import userModel from '../dao/models/userModel.js';
import {createHash, isValidPassword} from '../utils/functionsUtil.js';

const localStratergy = local.Strategy;
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


    passport.use('register', new localStratergy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {
            const { first_name, last_name, email, age} = req.body;

            try {
                let user = await userModel.findOne({ email: username});
                if (user) {
                    console.log("User already exist!");
                    return done(null, false);
                }

                const newUser = { first_name, last_name, email, age, password: createHash(password)}
                const result = await userModel.create(newUser);

                return done(null, result);
            } catch (error) {
                return done(null,false);
            }
        }
    ))

    passport.use('login', new localStratergy(
        {
            usernameField: 'email'
        },
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });
                if (!user) {
                    console.log("User not found!");
                    return done(null, false);
                }
                
                if (!isValidPassword(user, password)) {
                    return done(null, false);
                }

                return done(null, user);
            } catch(error) {
                console.log(error.message);
                return done(null,false);
            }
        }
    ));

    passport.use('restore', new localStratergy(
        {
            usernameField: 'email'
        },
        async (username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });
                if (!user) {
                    console.log("User not found!");
                    return done(null, false);
                }
                const newPassword = createHash(password);
                user.password = newPassword;
                await userModel.updateOne({email: username}, user);
                return done(null, user);
            } catch(error) {
                console.log(error.message);
                return done(null,false);
            }
        }
    ));


    passport.serializeUser((user, done) => done(null, user._id));

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    })
}

export default initializatePassport;