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

    GITHUNSTRATEGY:{
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
        callbackURL: process.env.callbackURL
    },

    ADMIN:{
        EMAIL: process.env.ADMIN_EMAIL,
        PASSWORD: process.env.ADMIN_PASSWORD
    },

}