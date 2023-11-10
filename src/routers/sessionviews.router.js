//router para llevar a formulario de login registro  o perfil
import {Router} from 'express'
import sessionController from '../controllers/sessionviews.controller.js'

const router = Router()

router.get('/register', sessionController.registerPage)

router.get('/', sessionController.loginPage)

router.get('/current',sessionController.profile)  

export default router