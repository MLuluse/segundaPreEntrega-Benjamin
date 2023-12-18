import { Router } from "express";
import { deleteProductByIdController, getAllProductsContoller, getProductsByIdController, postProductOnDBController, updateProductByIdController } from "../controllers/product.controller.js";
import { handlePolices } from "../middlewares/auth.middleware.js";

const router = Router()

router.get('/', handlePolices(['USER', 'ADMIN', 'PREMIUM']), getAllProductsContoller)  
 
router.get('/:pid', handlePolices(['USER', 'ADMIN']),getProductsByIdController ) 

router.post('/', handlePolices(['PREMIUM', 'ADMIN']),postProductOnDBController ) 

router.put('/:pid', handlePolices(['ADMIN', 'PREMIUM']),updateProductByIdController )

router.delete('/:pid', handlePolices(['ADMIN', 'PREMIUM']),deleteProductByIdController ) 

export default router