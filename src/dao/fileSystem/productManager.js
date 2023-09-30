import fs from "fs";

class ProductManager {
  #path = "./data/products.json";

  //cosntructor de la ruta al producto
  constructor(path) {
    this.#path = path;
    this.#init();
  }
  //metodo init, chequea si existe el producto
  async #init() {
    if (!fs.existsSync(this.#path)) {
      await fs.promises.writeFile(this.#path, JSON.stringify([], null, 2));
    }
  }

  // generas el Id del Producto
  #generateID(products) {
    if (products.length === 0) return 1
    return products[products.length-1].pid + 1
  }

  //agrega el producto
  async addProduct(product) {
    if (!product.title || !product.description || !product.price || !product.thumbnail ||!product.code ||!product.stock||!product.category||!product.status) {
      return "Error: Todos los campos son obligatorios";
    }
    if (!fs.existsSync(this.#path)) return "Error no existe";
    let data = await fs.promises.readFile(this.#path, "utf-8");
    let products = JSON.parse(data);
    const found = products.find((item) => item.code === product.code); // verifica que el codigo no se repita

    if (found) return "Error: Producto con el mismo codigo";
    
    const productToAdd = { pid: this.#generateID(products), ...product };
    products.push(productToAdd);
    await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 2));
    return productToAdd;
  }

  //devuelve el producto
  async getProducts() {
    if (!fs.existsSync(this.#path)) return "Error el archivo no existe";
    let data = await fs.promises.readFile(this.#path, "utf-8");
    const products = JSON.parse(data);
    return products;
  }

  //obtiene el producto desde el ID
  async getProductById(pid) {
    if (!fs.existsSync(this.#path)) return "Error el producto no existe, esto es ProductManager";
    let data = await fs.promises.readFile(this.#path, "utf-8");
    let products = JSON.parse(data);
    let product = products.find((item )=> item.pid === pid);
    if(!product) {
      return '[Error], producto no entontrado PM'}
    return product;
  }
  
//actualiza los productos cuando se le da id
  async updateProduct(pid, updateProduct) {
    if (!fs.existsSync(this.#path)) return "El producto no existe A";
    let isFound = false;
    let data = await fs.promises.readFile(this.#path, "utf-8");
    let products = JSON.parse(data);
    let newProducts = products.map(item => {
      if (item.pid === pid) {
        isFound = true;
        return {
          ...item,
          ...updateProduct,
        }  
      } else return item;
    });
    if (!isFound) return "El producto no existe B";
    await fs.promises.writeFile(
      this.#path,
      JSON.stringify(newProducts, null, 2)
    );
    return newProducts.find((item) => item.pid === pid);
  }

  async deleteProduct(id) {
    if (!fs.existsSync(this.#path)) return "Error no exixte el producto";
    let isFound = false;
    let data = await fs.promises.readFile(this.#path, "utf-8");
    let products = JSON.parse(data);

    const productIndex = products.findIndex((item) => item.pid === id);

    if (productIndex !== -1) {
      let isFound = true;
      products.splice(productIndex, 1); // Elimina el producto del arreglo
      await fs.promises.writeFile(this.#path, JSON.stringify(products, null, 2));
      return "El producto se elimino con exito";
    }
  
    return "El producto no existe"; 
    
  }
}

export default ProductManager;