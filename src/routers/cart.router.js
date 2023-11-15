import { createCartController, deleteCartController, deleteProductFromCartController, getCartByIdController,  postProductAndQuantityOnCartIdController, updateCartController, updateProductFromCartController,purchaseCartController } from '../controllers/cart.controller.js';
import { Router } from "express";

const router = Router()

router.post('/', createCartController)

router.get('/:cid', getCartByIdController) //user

router.post('/:cid/products/:pid', postProductAndQuantityOnCartIdController ) //este puede solo usarlo un user

router.delete('/:cid/products/:pid', deleteProductFromCartController) //este solo un user 

router.put('/:cid', updateCartController)

router.put('/:cid/products/:pid', updateProductFromCartController)

router.delete('/:cid', deleteCartController)

router.get('/:cid/purchase', purchaseCartController)

export default router