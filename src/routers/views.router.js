import {Router} from "express"
import { cartInfoViewsController, getProductsViewController, realtimeProductsViewController } from "../controllers/views.controller.js"

const router = Router()

router.get('/' , getProductsViewController)

router.get('/realtimeproducts', realtimeProductsViewController)

router.get('/:cid', cartInfoViewsController)

export default router