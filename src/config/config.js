import dotenv from 'dotenv'

dotenv.config()

export default{
    MONGO:{
        URI: process.env.MONGOURL,
        DB_NAME: process.env.MONGO_DB_NAME
       },

    PORT:{
        PORT: process.env.PORT
    },

    SECRET:{
        SESSION_SECRET: process.env.SESSION_SECRET
    },

    GITHUBSTRATEGY:{
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: process.env.callbackURL
    },

    ADMIN:{
        EMAIL: process.env.ADMIN_EMAIL,
        PASSWORD: process.env.ADMIN_PASSWORD
    },

    ENVIRONMENT:{
        PROD: process.env.ENVIRONMENT_prod,
        DEV: process.env.ENVIRONMENT_dev
    },
    
    STRIPE:{
        SECRET: process.env.STRIPE_SECRET,
        PUBLIC: process.env.STRIPE_PUBLICABLE
    }
}