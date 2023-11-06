import productModel from "../models/product.model.js"
import config from "../../config/config.js"

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