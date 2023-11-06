import cartModel from "../models/cart.model.js"

export const createCart = async () => {
    try{
        const newCart = await cartModel.create({})
        return newCart
    }catch(err){
        return('Error al crear carrito manager', err.message)
        }
}

export const getCartById = async (req, res) => {
    try{
        const cart = await getProductsFromCart(req, res)
        return cart
    }catch(err){
        return('Error al obtener el carrito con sus productos', err.message)
        }
}

export const findCartById = async (cid) => {
    try{
        const cartById = await cartModel.findById(cid)
        return cartById
    }catch(err){
        return('Error al encontrar un carrito con este id', err.message)
    }
}

export const findAndUpdate = async (cid) => {
    try{
        const update = await cartModel.findByIdAndUpdate(cid) 
    }catch(err){
        return('Error al encontrar un carrito para actualizar', err.message)
    }
}