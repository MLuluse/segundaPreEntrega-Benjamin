import { createCartController, deleteCartController, deleteProductFromCartController, getCartByIdController,  postProductAndQuantityOnCartIdController, updateCartController, updateProductFromCartController,purchaseCartController } from '../controllers/cart.controller.js';
import { Router } from "express";
import { handlePolices } from "../middlewares/auth.middleware.js"

const router = Router()

router.post('/', createCartController)

router.get('/:cid', handlePolices(['USER']),getCartByIdController) //user

router.post('/:cid/products/:pid', handlePolices(['USER', 'PREMIUM']),postProductAndQuantityOnCartIdController ) //este puede solo usarlo un user

router.delete('/:cid/products/:pid', handlePolices(['USER']),deleteProductFromCartController) //este solo un user 

router.put('/:cid', updateCartController)

router.put('/:cid/products/:pid', updateProductFromCartController)

router.delete('/:cid', deleteCartController)

router.get('/:cid/purchase', purchaseCartController)

export default router