import { Router } from "express";
import { deleteProductByIdController, getAllProductsContoller, getProductsByIdController, postProductOnDBController, updateProductByIdController } from "../controllers/product.controller.js";
import { handlePolices } from "../middlewares/auth.middleware.js";

const router = Router()

router.get('/', getAllProductsContoller)  
 
router.get('/:pid', handlePolices(['USER', 'ADMIN']),getProductsByIdController ) 

router.post('/', postProductOnDBController ) 

router.put('/:pid', handlePolices(['ADMIN']),updateProductByIdController )

router.delete('/:pid', handlePolices(['ADMIN']),deleteProductByIdController ) 

export default router