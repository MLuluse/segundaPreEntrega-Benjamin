import { createCartController, deleteCartController, deleteProductFromCartController, getCartByIdController,  postProductAndQuantityOnCartIdController, updateCartController, updateProductFromCartController,purchaseCartController } from '../controllers/cart.controller.js';
import { Router } from "express";
import { handlePolices } from "../middlewares/auth.middleware.js"

const router = Router()

router.post('/', createCartController)

router.get('/:cid', handlePolices(['USER', 'PREMIUM']),getCartByIdController) 

router.post('/:cid/products/:pid', handlePolices(['USER', 'PREMIUM']),postProductAndQuantityOnCartIdController ) 

router.delete('/:cid/products/:pid', handlePolices(['USER', 'PREMIUM']),deleteProductFromCartController) //este solo un user 

router.put('/:cid', updateCartController)

router.put('/:cid/products/:pid', updateProductFromCartController)

router.delete('/:cid', deleteCartController)

router.get('/:cid/purchase', purchaseCartController)

export default router