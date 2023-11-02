import config from "../config/config.js";
import productModel from "../dao/models/product.model.js";


const PORT = config.PORT.PORT

export const getProductsFromDB = async (req, res) =>{
    try{
        const limit = req.query.limit || 10
        const page = parseInt(req.query.page) || 1

        const filterOptions = {}

        if (req.query.stock) filterOptions.stock = req.query.stock
        if (req.query.category) filterOptions.category = req.query.category

        const paginateOptions = { lean: true, limit, page}

        if (req.query.sort === 'asc') paginateOptions.sort = { price: 1 }
        if (req.query.sort === 'desc') paginateOptions.sort = { price: -1 }

        const result = await productModel.paginate(filterOptions, paginateOptions)
        // console.log('resultado de lo que trae el result de paginate', result)
        
        const protocol = req.protocol;
        const baseUrl = req.baseUrl;
        
        const prevPage = page > 1 ? page - 1 : null
        const nextPage = page < result.totalPages ? page + 1 : null

        const prevLink = `${protocol}://${req.hostname}:${PORT}${baseUrl}?&page=${prevPage}`;
        const nextLink = `${protocol}://${req.hostname}:${PORT}${baseUrl}?&page=${nextPage}`

       
        return {
            statusCode: 200,
            response: { 
                status: 'success', 
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? prevLink : null,
                nextLink: result.hasNextPage ? nextLink : null
            }
        }
    }catch(err){
        return('Error al recibir los productos del DB', err.message)
    }
}

export const getAllProductsContoller = async(req, res) =>{
    try{
    let productos = await getProductsFromDB(req, res)

    if (!productos || productos.length === 0 ) res.status(404).json({status:'error', payload:'No hay productos para devolver'})
    res.status(200).json({ payload: productos });

}catch(err){

    res.status(500).json({status:'Error', payload: err.message})
}
}

export const getProductsByIdController = async(req, res) => {
    const productId = req.params.pid
    try {
    const product = await productModel.findById(productId).lean().exec()
    if (!product) return res.status(404).json({ status: "error", payload: "El producto no existe, esto es Router" })
    res.status(200).json({ payload:product})
    }catch (err) {
        res.status(500).json({status: 'error', error: err.message})
    }
}

export const postProductOnDBController = async(req, res) => {
    const product =  req.body
    try{
        const newProduct = await productModel.create(product)   
        const products =  await productModel.find().lean().exec()
        
        res.status(201).json({ status: 'success', payload: products})

    }catch(err) {
        res.status(500).json({status: 'error', error: err.message})
    }
}

export const updateProductByIdController = async(req, res) => {
    const productId = req.params.pid
    const info = req.body
    try{
    const prodactualizado = await productModel.updateOne({_id: productId},info)
    if (!prodactualizado) {
        return res.status(404).json({ status: 'error', error: 'Not found' })
    }
    const products = await productModel.find().lean().exec()
    res.status(200).json({status: 'success', payload: products})

    }catch(err){
        res.status(500).json({status: 'error', error: err.message})
    }
}

export const deleteProductByIdController = async( req, res) =>{
    const productId = req.params.pid
    try{
        const borrar =  await productModel.findOneAndDelete({_id:productId})
        if (!borrar) {
            return res.status(404).json({ status: 'error', error: 'no existe el producto a borrar' })
        }
        const products = await productModel.find().lean().exec()
        res.status(200).json({status: 'success', payload: products})
 
    }catch(err){
        res.status(500).json({status: 'error', error: err.message})
    }
}