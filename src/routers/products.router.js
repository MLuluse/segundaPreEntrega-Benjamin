import { Router } from "express";
import { deleteProductByIdController, getAllProductsContoller, getProductsByIdController, postProductOnDBController, updateProductByIdController } from "../controllers/product.controller.js";

const router = Router()

router.get('/', getAllProductsContoller)

router.get('/:pid', getProductsByIdController )

router.post('/', postProductOnDBController )

router.put('/:pid', updateProductByIdController )

router.delete('/:pid', deleteProductByIdController )

export default router