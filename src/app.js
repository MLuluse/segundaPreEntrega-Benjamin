import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
//-----Nuevos router despues de Mongoose-------//
import chatRouter from './routers/chat.router.js'
import productsRouter from "./routers/products.router.js";
import cartRouter from "./routers/cart.router.js"
import viewsNRouter from "./routers/views.router.js";


export const PORT = 8080

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//aca setea handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

app.use(express.static("./src/public")); //esto para mostara vistas

try {
  await mongoose.connect(
    "mongodb+srv://coder:coder@cluster0.9dp3egu.mongodb.net/",
    {
      dbName: "ecommerce",
    }
  );
  console.log("DB connected");
  const httpServer = app.listen(PORT, () => console.log("Server up!"));
  const socketServer = new Server(httpServer);

  socketServer.on("connection", (socketClient) => {
    console.log("New Socket connection", socketClient.id);
    socketClient.on("productList", async () => {
      const productList = await pm.getProducts();
      console.log(productList);
      socketServer.emit("updatedProducts", productList);
    });
  });
  const messages = [];
  socketServer.on("connection", (socketClient) => {
    console.log("Socket de chat on");
    socketClient.on("message", (data) => {
      messages.push(data);
      socketServer.emit("logs", messages);
    });
  });
  // renderiza el view de un index sin nada
  app.get('/', (req, res) => res.render('index'))
  //Data OnWire
  app.use("/api/products", productsRouter);
  app.use("/api/carts", cartRouter);
  //HtMl On Wire
  app.use("/products", viewsNRouter);
  app.use("/carts", viewsNRouter);

  app.use("/chat", chatRouter);
} catch (err) {
  console.log("No pudo conectarse a la DB porque", err.message);
}