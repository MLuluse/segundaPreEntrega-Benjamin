import { ProductService, TicketService } from '../services/services.js'
import { CartService } from '../services/services.js'
import { PORT } from '../app.js'

export const getProductsViewController = async (req, res) => {
    const result = await ProductService.getAllPaginate(req, res)
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
    const result = await ProductService.getAllPaginate(req, res)
    //console.log('resultado del realtime', result)
    if (result.statusCode === 200) {
        res.render('realTimeProducts', { products: result.response.payload })
    } else {
        res.status(result.statusCode).json({ status: 'error', error: result.response.error })
    }
}

export const cartInfoViewsController = async(req, res) => {
    const result = await CartService.getProductsFromCart(req, res)
   
    if (result.statusCode === 200) {
        res.render('cart', { cart: result.response.payload})
        //console.log(result.response.payload)
    } else {
        res.status(result.statusCode).json({ status: 'error', error: result.response.error })
    }
}

export const productDetailViewController =  async (req, res) => {
        const pid = req.params.pid
        const result = await ProductService.getById(pid)
        //console.log(result, 'desde el viewcontroller')
        if (!result) return res.status(404).render({error: 'No pudimos encontrar el producto con este ID!!'})
        res.status(200).render("product", {product: result})

    }



