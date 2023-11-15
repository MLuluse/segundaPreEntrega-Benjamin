//import {getAll, getProductsById, createProduct, printProducts, updateProduct, deleteProduct} from "../dao/manager/product.DAOmanager.js"
import { ProductService } from "../services/services.js"

//ALL
export const getAllProductsContoller = async(req, res) =>{
    try{
    let productos = await ProductService.getAll(req, res)
    if (!productos || productos.length === 0 ) res.status(404).json({status:'error', payload:'No hay productos para devolver'})
    res.status(200).json({ payload: productos });

}catch(err){

    res.status(500).json({status:'Error', payload: err.message})
}
}

export const getProductsByIdController = async(req, res) => {
    const productId = req.params.pid
    try {
    const product = await ProductService.getById(productId)
    if (!product) return res.status(404).json({ status: "error", payload: "El producto no existe, esto es Router" })
    res.status(200).json({ payload:product})
    }catch (err) {
        res.status(500).json({status: 'error', error: err.message})
    }
}

export const postProductOnDBController = async(req, res) => {
    const product =  req.body
    try{
        const newProduct = await ProductService.create(product) 
        const products =  await ProductService.printProducts()
        req.socketServer.emit('updatedProducts', products)
        res.status(201).json({ status: 'success', payload: products})

    }catch(err) {
        res.status(500).json({status: 'error', error: err.message})
    }
}

export const updateProductByIdController = async(req, res) => {
    const productId = req.params.pid
    const info = req.body
    try{
    const prodactualizado = await ProductService.update({_id: productId},info)
    if (!prodactualizado) {
        return res.status(404).json({ status: 'error', error: 'Not found' })
    }
    const products = await printProducts()
    req.socketServer.emit('updatedProducts', products)
    res.status(200).json({status: 'success', payload: products})

    }catch(err){
        res.status(500).json({status: 'error', error: err.message})
    }
}

export const deleteProductByIdController = async( req, res) =>{
    const productId = req.params.pid
    try{
        const borrar =  await ProductService.remove({_id:productId})
        if (!borrar) {
            return res.status(404).json({ status: 'error', error: 'no existe el producto a borrar' })
        }
        const products = await printProducts()
        req.socketServer.emit('updatedProducts', products)
        res.status(200).json({status: 'success', payload: products})
 
    }catch(err){
        res.status(500).json({status: 'error', error: err.message})
    }
}