import cartModel from "../models/cart.model.js"

const cartDAO ={
    getProductsFromCart : async (req, res) => {
    try {
        const id = req.params.cid
        const productsOnCart = await cartModel.findById(id).populate('products.product').lean()
        if (productsOnCart === null) {
            return {
                statusCode: 404,
                response: { status: 'error', error: 'Not found' }
            }
        }
        return {
            statusCode: 200,
            response: { status: 'success', payload: productsOnCart }
        }
    } catch(err) {
        return {
            statusCode: 500,
            response: { status: 'error', error: err.message }
        }
    }
},

    createCart : async () => {
    try{
        const newCart = await cartModel.create({})
        return newCart
    }catch(err){
        return('Error al crear carrito manager', err.message)
        }
},

    getCartById : async (req, res) => {
    try{
        const cart = await getProductsFromCart(req, res)
        return cart
    }catch(err){
        return('Error al obtener el carrito con sus productos', err.message)
        }
    },

    findCartById : async (cid) => {
    try{
        const cartById = await cartModel.findById(cid)
        return cartById
    }catch(err){
        return('Error al encontrar un carrito con este id', err.message)
    }
},

    findAndUpdate : async (cid, update) => {
    try{
        const updatedCart = await cartModel.findByIdAndUpdate(cid, update, {new:true}) 
        return updatedCart
    }catch(err){
        return('Error al encontrar un carrito para actualizar', err.message)
    }
},
    clearProductsFromCart : async ()=> {
        try{
            const clearCart = await cartModel.findByIdAndUpdate(cid, { $set: { products: [] } }, { new: true })
            return clearCart
        }catch(err){
            return('Error al encontrar un carrito para actualizar', err.message)
        }
    }
}

export default cartDAO