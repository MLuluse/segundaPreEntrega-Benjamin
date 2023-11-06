//import { getProductsFromDB } from '../controllers/product.controller.js'
//import { getProductsFromCart } from '../controllers/cart.controller.js'
import {getProductsFromDB} from '../dao/manager/getProductsFromDB.js'
import getProductsFromCart from '../dao/manager/getProductsFromCart.js'
import { PORT } from '../app.js'

export const getProductsViewController = async (req, res) => {
    const result = await getProductsFromDB(req, res)
    // console.log('resultado de get en views', result)
    if (result.statusCode === 200) {
        const totalPages = []
        let link
        for (let index = 1; index <= result.response.totalPages; index++) {
            if (!req.query.page) {
                link = `http://${req.hostname}:${PORT}${req.originalUrl}?&page=${index}`
            } else {
                const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${index}`)
                link = `http://${req.hostname}:${PORT}${modifiedUrl}`
            }
            totalPages.push({ page: index, link })
        }

        const user =  req.session.user
        console.log(user)
        res.render('home', { user, products: result.response.payload, paginateInfo: {
                hasPrevPage: result.response.hasPrevPage,
                hasNextPage: result.response.hasNextPage,
                prevLink: result.response.prevLink,
                nextLink: result.response.nextLink,
                totalPages
            }
        })
    } else {
        res.status(result.statusCode).json({ status: 'error', error: result.response.error })
    }
}

export const realtimeProductsViewController = async (req, res) => {
    const result = await getProductsFromDB(req, res)
    //console.log('resultado del realtime', result)
    if (result.statusCode === 200) {
        res.render('realTimeProducts', { products: result.response.payload })
    } else {
        res.status(result.statusCode).json({ status: 'error', error: result.response.error })
    }
}

export const cartInfoViewsController = async(req, res) => {
    const result = await getProductsFromCart(req, res)
    //console.log('este es el result del get', result)
    if (result.statusCode === 200) {
        res.render('cart', { cart: result.response.payload})
        //console.log(result.response.payload)
    } else {
        res.status(result.statusCode).json({ status: 'error', error: result.response.error })
    }
}