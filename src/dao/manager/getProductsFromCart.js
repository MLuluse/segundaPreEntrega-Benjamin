import cartModel from '../models/cart.model.js'

const getProductsFromCart = async (req, res) => {
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
}
export default getProductsFromCart


