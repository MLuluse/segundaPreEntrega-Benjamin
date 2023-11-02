import { createCartController, deleteCartController, deleteProductFromCartController, getCartByIdController,  postProductAndQuantityOnCartIdController, updateCartController, updateProductFromCartController } from '../controllers/cart.controller.js';
import cartModel from  '../dao/models/cart.model.js'
import productModel from "../dao/models/product.model.js"
import { Router } from "express";

const router = Router()

router.post('/', createCartController)

router.get('/:cid', getCartByIdController)

router.post('/:cid/products/:pid', postProductAndQuantityOnCartIdController )

router.delete('/:cid/products/:pid', deleteProductFromCartController)

router.put('/:cid', updateCartController)

router.put('/:cid/products/:pid', updateProductFromCartController)

router.delete('/:cid', deleteCartController)

export default router