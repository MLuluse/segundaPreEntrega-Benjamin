import fs from "fs";
import ProductManager from "./productManager.js";

// aca instancia el productManager porque necesita traer info del producto tambien
const productManager = new ProductManager("./data/products.json");

class CartManager {
  //crea ruta
  #path = "../data/cart.json";

  constructor(path) {
    this.#path = path;
    this.#init();
  }

  //verifica si el carrito existe
  async #init() {
    if (!fs.existsSync(this.#path)) {
      await fs.promises.writeFile(this.#path, JSON.stringify([], null, 2));
    }
  }
  // generas el Id del Carrito
  #generateID(cart) {
    if (cart.length === 0) return 1;
    return cart[cart.length - 1].cid + 1;
  }

  // crea el carrito
  async createCart() {
    let data = await fs.promises.readFile(this.#path, "utf-8"); //lee el archivo de carrito
    let carts = JSON.parse(data); // lo pone en memoria
    const cartToAdd = { cid: this.#generateID(carts), products: [] }; // genera el id del carrito
    carts.push(cartToAdd);
    await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2));
    return cartToAdd;
  }

  //obtiene los productos dentro del carrito
  async getCartById(cid) {
    if (!fs.existsSync(this.#path)) return "[ 500] El archivo carrito no existe";
    let data = await fs.promises.readFile(this.#path, "utf-8");
    let carts = JSON.parse(data);

    let cart = carts.find((item) => item.cid === cid);
    if (!cart) return "[404] Carrito no encontrado";
    return cart;
  }

  //agrega productos al carrito -----> si el producto ya existe aumentar la cantidad
  async addProductsToCart(cid, pid) {
    if (!fs.existsSync(this.#path)) return "[ 500] El archivo carrito no existe";
    const result = await productManager.getProductById(pid); //obtengo el producto a agregar --- me fijo si existe
    if (!result) return "[400] El producto no fue encontrado";
    const cart = await this.getCartById(cid); // me fijo si el carrito existe
    if (!cart) return "[404] El carrito con ese id no fue encontrado";
    const productIndex = cart.products.findIndex((item) => item.product === pid); // con el findIndex verifico si el prod ya esta en el carrito
    if (productIndex > -1) {
      // si esta la cantidad es mayor a -1 entocesa bajo
      cart.products[productIndex].quantity += 1; // aca suma uno a la cantidad
    } else {
      // si no esta
      cart.products.push({ product: pid, quantity: 1 }); // aca crea la cantidad
    }
    let data = await fs.promises.readFile(this.#path, "utf-8");
    let carts = JSON.parse(data);
    carts = carts.map((item) => {
      if (item.cid === cid) {
        return cart;
      } else {
        return item;
      } 
    });
    await fs.promises.writeFile(this.#path, JSON.stringify(carts, null, 2));
    return cart;
  }
  
 
}

export default CartManager;