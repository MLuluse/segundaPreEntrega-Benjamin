import passport from "passport"
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import { createHash, isValidPassword } from "../utils/utils.js"

import config from './config.js'
import { UserService } from "../services/services.js"
import { CartService } from "../services/services.js"
import logger from "../utils/logger.js"


const localStrategy = local.Strategy 

const initializePassport = () => {
    //logica de registro ---ahora este es el middleware
    passport.use('register', new localStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async( req, username, password, done ) =>{
        const {first_name, last_name, email, age} = req.body
        try{
            const user = await UserService.findUser({email: username })
            if (user){
                logger.warning('El usuario ya existe')
                return done(null, false)
            }

            const Cart = await CartService.create({}) //creo el carrito para el register

            const newUser = {
                first_name, 
                last_name, 
                email, 
                age, 
                password: createHash(password), 
                cart: Cart._id,
                role: email === config.ADMIN.EMAIL ? 'admin' : 'user' 
            }
            //console.log('desde adentro delpassport', newUser)
            const result = await UserService.createUser(newUser)
            return done (null, result)
        }catch(err){
            return done(err)
        }
    })) 
    
    //logica de login
    passport.use('login', new localStrategy({
        usernameField: 'email',
    }, async(username, password, done) => {
        try {
           if (username === config.ADMIN.EMAIL && password === config.ADMIN.PASSWORD) {
                const admin = {
                    _id: 'admin', 
                    first_name: 'Administrador',
                    email: username,
                    role: 'admin',
                };
                return done(null, admin);
            }

            const user = await UserService.findUser({ email: username })
            //console.log('user en el pasport', user)
            const uConeccion = await UserService.findAndUpdate(user._id, {last_connection: new Date})
            //console.log('Ultima coneccion', uConeccion)
            if (!user) {
                return done(null, false)
            }
            if (!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch(err) {return done(err)}
    }))

    //credenciales de terceros
    passport.use('github', new GitHubStrategy({
        clientID: config.GITHUBSTRATEGY.clientID, 
        clientSecret: config.GITHUBSTRATEGY.clientSecret,
        callbackURL: config.GITHUBSTRATEGY.callbackURL
    }, async(accessToken, refreshToken, profile, done) =>{
        //console.log(profile)
        try{
            const user = await UserService.findUser({email: profile._json.email})
            if (user){ 
            const uConeccion = await UserService.findAndUpdate(user._id, {last_connection: new Date})
            console.log('Ultima coneccion', uConeccion)
            return done(null, user) }//si ya existe el ususario no lo guarda en base de datos

            const Cart = await CartService.create({})  //creo el carrito para github
            const newUser = {
                first_name: profile._json.login,
                last_name: profile._json.name,
                email: profile._json.email,
                //password: profile._json.password,
                //role: "user",
                cart: Cart._id
            }
            //console.log('newUser github',newUser)
            const result = await UserService.createUser(newUser)
            //console.log('result github', result)
            return done(null, result)
        }catch(err) {
            logger.error('no  se pudo entrar con github', err.message)
            //console.log('error en github', err)
            return done(`Error to login with github ${err}`)
        }
    }))

    passport.serializeUser((user, done) => {    //sirve para que passport grabe datos en la session solo el id del usuario graba
        done(null, user._id)
    })

    passport.deserializeUser(async(id, done) => {  //para que teniendo el id puede obtener el resto de los datos del usuario
        if (id === 'admin') {
            const adminUser = {
                _id: 'admin',
                username: 'adminCoder@coder.com',
                role: 'admin',
            };
            return done(null, adminUser);
        }
        const user = await UserService.findById(id)
        done(null, user)
    })

}

export default initializePassport