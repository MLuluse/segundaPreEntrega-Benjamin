import { ProductService } from "../services/services.js"
import CustomError from "../services/errors/costum_error.js"
import EErros from "../services/errors/enums.js"
import  {generateErrorInfo}  from "../services/errors/info.js"
import logger from "../utils/logger.js"

//ALL
export const getAllProductsContoller = async(req, res) =>{
    try{
    let productos = await ProductService.getAllPaginate(req, res)
    if (!productos || productos.length === 0 ) res.status(404).json({status:'error', payload:'No hay productos para devolver'})
    res.status(200).json({ payload: productos });

}catch(err){
    logger.error('Error al tratar de traer todos los productos', err.message)
    res.status(500).json({status:'Error', payload: err.message})
}
}

export const getProductsByIdController = async(req, res) => {
    const productId = req.params.pid
    try {
    const product = await ProductService.getById(productId)
    if (!product) return res.status(404).json({ status: "error", payload: "El producto no existe" })
    res.status(200).json({ payload:product})
    }catch (err) {
        logger.error("Error al leer el producto", err.message)
        res.status(500).json({status: 'error', error: err.message})
    }
}

export const postProductOnDBController = async(req, res) => { 
    if (!req.body.title || !req.body.description || !req.body.price || !req.body.code || !req.body.category || !req.body.tumbnails || !req.body.stock){
       CustomError.createError({
            name: "Product creation error",
            cause: generateErrorInfo(req.body),
            message: "Error trying to create a product" + generateErrorInfo(req.body),
            code: EErros.INVALID_TYPES_ERROR
            })
        }
    try{
        const product = req.body
        product.owner = req.session.user.email
        const newProduct = await ProductService.create(product) 
        //const products =  await ProductService.printProducts()
        return res.status(201).json({ status: 'success', payload: newProduct})   
    }catch(err){
        logger.error("Error al crear el producto", err.message)
        res.status(500).json({status: 'error', error: err.message})
    }
}



export const updateProductByIdController = async(req, res) => {
    const productId = req.params.pid
    const info = req.body
    try{
    const prodactualizado = await ProductService.update( productId, info)
    if (!prodactualizado) {
        return res.status(404).json({ status: 'error', error: 'Not found' })
    }
    const products = await ProductService.printProducts()
    //req.socketServer.emit('updatedProducts', products)
    res.status(200).json({status: 'success', payload: products})

    }catch(err){
        logger.error("Error al actualizar los datos del producto", err.message)
        res.status(500).json({status: 'error', error: err.message})
    }
}

export const deleteProductByIdController = async( req, res) =>{
    try{
        const productId = req.params.pid
        if (req.session.user.role === 'premium'){
            const product = await ProductService.getById(productId)
            if(product.owner !== req.session.user.email){
                return res.status(403).json({status: 'error', error: 'No esta autorizado a borrar el producto'})
            } 
        }
        const borrar =  await ProductService.remove(productId)
        if (!borrar) {
            return res.status(404).json({ status: 'error', error: 'no existe el producto a borrar' })
        }
        const products = await ProductService.printProducts()
       // req.socketServer.emit('updatedProducts', products)
        res.status(200).json({status: 'success', payload: products})
 
    }catch(err){
        logger.error(`Error al eliminar el producto", ${err.message}`)
        res.status(500).json({status: 'error', error: err.message})
    }
}