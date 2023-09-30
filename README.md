# BACKEND DE E-COMMERCE  PARA CURSADA 47290

# API con Node.js y Express

Este proyecto está destinado al desarrollo de una API utilizando Node.js y el framework Express.js. La API se encarga de gestionar datos relacionados con productos y carritos de compra utilizando una base de datos MongoDB. A continuación, se proporciona una visión general del proyecto.

## Tecnologías utilizadas

- Node.js
- Express.js
- Express Handlebars
- Mongoose
- Mongoose Paginate V2
- Socket.io

## Configuración del proyecto

Asegúrate de instalar todas las dependencias del proyecto utilizando el siguiente comando:
npm install

## Ejecutar la aplicación
Para iniciar la aplicación, utiliza el siguiente comando:
npm run dev

La aplicación se ejecutará en localhost:8080.

## Rutas de la API
# Productos
GET /api/products: Obtiene todos los productos.
POST /api/products: Crea un nuevo producto.
PUT /api/products/:pid: Actualiza un producto existente.
DELETE /api/products/:pid: Elimina un producto existente.

# Carritos
GET /api/carts/:cid Obtiene un carrito específico.
POST /api/carts Crea un nuevo carrito.
PUT /api/carts/:cid Actualiza un carrito existente.
DELETE /api/carts/:cid Elimina un carrito existente.

# Interacción con la aplicación
Puedes interactuar con la API utilizando las siguientes rutas:

Ver todos los productos: GET localhost:8080/api/products
Ver un carrito específico: GET localhost:8080/api/carts/:cid
Ver todos los productos en una vista HTML: GET localhost:8080/products
Ver todos los carritos en una vista HTML: GET localhost:8080/carts/:cid


## esta API esta en sus primeros pasos de desarrollo