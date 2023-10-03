import { Router } from "express";
import productModel from "../dao/models/product.model.js";
import { PORT } from "../app.js";

const router = Router()

export const getProductsFromDB =  async( req, res) =>{
    try{
        // recibe por query el limite de productos  y paginas
        const limit = req.query.limit || 10
        const currentPage = req.query.page || 1

        //opciones de filtrado por categoria o disponibilidad
        const filterOptions = {}
        if (req.query.stock) filterOptions.stock = req.query.stock
        if (req.query.category) filterOptions.category = req.query.category
        const paginateOptions = { lean: true, limit, currentPage}

        //aca hace un sort ascendente o descendentes segun se pida
        if (req.query.sort === 'asc') paginateOptions.sort = { price: 1 }
        if (req.query.sort === 'desc') paginateOptions.sort = { price: -1 }

        const result = await productModel.paginate(filterOptions, paginateOptions)
        // console.log('resultado de lo que trae el result de paginate', result)
        
        //aca traigo metodos http, para hacer los links
        const protocol = req.protocol;
        const baseUrl = req.baseUrl;
        
        const prevPage = currentPage > 1 ? currentPage - 1 : null
        const nextPage = currentPage < result.totalPages ? currentPage + 1 : null

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


router.get('/', async(req, res) =>{
    // trae todos los productos
    try{
    let productos = await getProductsFromDB(req, res)

    if (!productos || productos.length === 0 ) res.status(404).json({status:'error', payload:'No hay productos para devolver'})
    res.status(200).json({ payload: productos });

}catch(err){

    res.status(500).json({status:'Error', payload: err.message})
}
})

//trae un producto por id
router.get('/:pid', async(req, res) => {
    const productId = req.params.pid
    try {
    const product = await productModel.findById(productId).lean().exec()
    if (!product) return res.status(404).json({ status: "error", payload: "El producto no existe, esto es Router" })
    res.status(200).json({ payload:product})
    }catch (err) {
        res.status(500).json({status: 'error', error: err.message})
    }
})

//postea producto en db
router.post('/', async(req, res) => {
    const product =  req.body
    try{
        const newProduct = await productModel.create(product)   
        const products =  await productModel.find().lean().exec()
        
        res.status(201).json({ status: 'success', payload: products})

    }catch(err) {
        res.status(500).json({status: 'error', error: err.message})
    }
})


//actualiza un producto especifico por id
router.put('/:pid', async(req, res) => {
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
})


//borra un producto por id
router.delete('/:pid', async( req, res) =>{
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
})

export default router