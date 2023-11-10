import {Router} from "express"
import { cartInfoViewsController, getProductsViewController, realtimeProductsViewController } from "../controllers/views.controller.js"
import { handlePolices } from "../middlewares/auth.middleware.js"

const router = Router()

router.get('/' , handlePolices(['USER', 'ADMIN']),getProductsViewController)

router.get('/realtimeproducts', handlePolices(['USER', 'ADMIN']),realtimeProductsViewController)

router.get('/:cid', handlePolices(['USER', 'ADMIN']),cartInfoViewsController)

export default router