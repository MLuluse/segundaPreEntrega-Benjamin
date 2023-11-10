import { Router } from "express";
import { deleteProductByIdController, getAllProductsContoller, getProductsByIdController, postProductOnDBController, updateProductByIdController } from "../controllers/product.controller.js";
import { handlePolices } from "../middlewares/auth.middleware.js";

const router = Router()

router.get('/', handlePolices(['USER', 'ADMIN']),getAllProductsContoller)  //esto es del admin y user
 
router.get('/:pid', handlePolices(['USER', 'ADMIN']),getProductsByIdController ) //esot es del admin y el user

router.post('/', handlePolices(['ADMIN']),postProductOnDBController ) //esto es del admin

router.put('/:pid', handlePolices(['ADMIN']),updateProductByIdController )//esto es del admin

router.delete('/:pid', handlePolices(['ADMIN']),deleteProductByIdController ) //esto es del admin

export default router