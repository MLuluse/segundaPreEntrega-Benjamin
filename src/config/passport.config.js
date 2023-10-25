import passport from "passport"
import local from 'passport-local'
import GitHubStrategy from 'passport-github2'
import { createHash, isValidPassword } from "../utils.js"
import userModel from "../dao/models/user.model.js"
import cartModel from "../dao/models/cart.model.js"


const localStrategy = local.Strategy 

const initializePassport = () => {
    //logica de registro ---ahora este es el middleware
    passport.use('register', new localStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async( req, username, password, done ) =>{
        const {first_name, last_name, email, age} = req.body
        try{
            const user = await userModel.findOne({email: username })
            if (user){
                console.log('El usuario ya existe')
                return done(null, false)
            }

            const Cart = await cartModel.create({}) //creo el carrito para el register

            const newUser = {
                first_name, last_name, email, age, password: createHash(password), cart: Cart._id,
            }
            const result = await userModel.create(newUser)
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
            if (username === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                const admin = {
                    _id: 'admin', 
                    first_name: 'Administrador',
                    email: username,
                    role: 'admin',
                };
                return done(null, admin);
            }

            const user = await userModel.findOne({ email: username })
            if (!user) {
                return done(null, false)
            }
            if (!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch(err) {return done(err)}
    }))

    //credenciales de terceros
    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.055f7754287d5df3', 
        clientSecret: '44f85f6d2c8c2bb408eb881afa43c7836e48d435',
        callbackURL: 'http://localhost:8080/api/session/githubcallback'
    }, async(accessToken, refreshToken, profile, done) =>{
       // console.log(profile)
        try{
            const user = await userModel.findOne({email: profile._json.email})
            if (user) return done(null, user) //si ya existe el ususario no lo guarda en base de datos

            const Cart = await cartModel.create({})  //creo el carrito para github
            const newUser = await userModel.create({
                first_name: profile._json.login,
                last_name: profile._json.name,
                email: profile._json.email,
                password: profile._json.password,
                role: profile._json.type,
                cart: Cart._id
            })
            return done(null, newUser)
        }catch(err) {
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
        const user = await userModel.findById(id)
        done(null, user)
    })

}

export default initializePassport