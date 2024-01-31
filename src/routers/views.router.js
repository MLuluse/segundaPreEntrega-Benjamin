import {Router} from "express"
import { cartInfoViewsController, getProductsViewController, realtimeProductsViewController, productDetailViewController, usersAdminViewontroller} from "../controllers/views.controller.js"
import { handlePolices } from "../middlewares/auth.middleware.js"

const router = Router()

router.get('/' , handlePolices(['USER', 'ADMIN', 'PREMIUM']),getProductsViewController)

router.get('/realtimeproducts', handlePolices(['USER', 'ADMIN','PREMIUM']),realtimeProductsViewController)

router.get('/:cid', handlePolices(['USER', 'ADMIN', 'PREMIUM']),cartInfoViewsController)

router.get('/product/:pid', handlePolices(['USER', 'ADMIN', 'PREMIUM']), productDetailViewController)

router.get('/usersAdminViews/:email', handlePolices(['ADMIN']), usersAdminViewontroller )




export default router