//router para llevar a formulario de login registro  o perfil
import {Router} from 'express'
import sessionController from '../controllers/sessionviews.controller.js'
import { handlePolices } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/register', sessionController.registerPage)

router.get('/', sessionController.loginPage)

router.get('/current',sessionController.profile)  

router.get('/forget-password', sessionController.forgetPass)

router.get('/reset-password/:token', sessionController.resetPass)

router.get('/create-update', handlePolices(['ADMIN', 'PREMIUM']),sessionController.createUpdate)

export default router