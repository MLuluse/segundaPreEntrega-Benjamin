import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from 'express-session'
import MongoStore from "connect-mongo";
//----passport----//
import passport from "passport";   
import initializePassport from "./config/passport.config.js"; 
//-----documentation-------//
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express'
const swaggerOptions = {
  definition:{
      openapi: "3.1.0",
      info: {
          title: 'Backend E-COMMERCE Coder',
          description: 'Esta es una api de e-commerce, que maneja usuarios, carritos y productos'
      }
  },
  apis: ['./docs/**/*.yaml']
}
const specs = swaggerJSDoc(swaggerOptions)
//-----Nuevos router despues de Mongoose-------//
import chatRouter from './routers/chat.router.js'
import productsRouter from "./routers/products.router.js";
import cartRouter from "./routers/cart.router.js"
import viewsRouter from "./routers/views.router.js";
import sessionViewsRouter from './routers/sessionviews.router.js'
import sessionRouter from './routers/session.router.js';
import mockRouter from './routers/mock.router.js'
import loggerTestRouter from './routers/logger.router.js'
import usersRouter from './routers/users.router.js'
//-----Variable de entorno-----//
import config from "./config/config.js";
//middleware
import errorHandler from './middlewares/error.js'
import logger from "./utils/logger.js";

export const PORT = config.PORT.PORT

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//en el endpoint /docs se muestre la documentacion
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use(session ({
  store: MongoStore.create({
    mongoUrl: config.MONGO.URI,
    dbName: config.MONGO.DB_NAME
  }),
  secret: config.SECRET.SESSION_SECRET,
  resave: true,
  saveUninitialized: true
}))

//aca setea handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

app.use(express.static("./src/public")); //esto para mostara vistas

//aca setea passport
initializePassport()  //ejecuto initializePassport para que arranque
app.use(passport.initialize())  // inicio pasport
app.use(passport.session())   //inicio la session de passport

try {
  await mongoose.connect(
    config.MONGO.URI,
    {
      dbName: config.MONGO.DB_NAME,
    }
  );
  logger.info("DB connected");
  const httpServer = app.listen(PORT, () => logger.info("Server up!"));

  const socketServer = new Server(httpServer);
  socketServer.on("connection", (socketClient) => {
    logger.info("New Socket connection", socketClient.id);
    socketClient.on("productList", async () => {
      const productList = await pm.getProducts();
      logger.info(productList);
      socketServer.emit("updatedProducts", productList);
    });
  });
  const messages = [];
  socketServer.on("connection", (socketClient) => {
    logger.info("Socket de chat on");
    socketClient.on("message", (data) => {
      messages.push(data);
      socketServer.emit("logs", messages);
    });
  });

  //Data OnWire
  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartRouter);
  app.use("/api/session", sessionRouter);
  app.use("/api/users", usersRouter)
  
  //HtMl On Wire
  app.use('/', sessionViewsRouter)
  app.use("/products", viewsRouter);
  app.use("/carts", viewsRouter);
  app.use("/users", viewsRouter );
  app.use("/chat", chatRouter);
  
  //Info extra de la API
  app.use('/mockingproducts', mockRouter);
  app.use('/loggerTest', loggerTestRouter);
  app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

  //app.use(errorHandler)

  
} catch (err) {
  logger.error("No pudo conectarse a la DB porque", err.message);
}
