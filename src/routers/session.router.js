//metodo de registro de usuario y su respectivo login
import { Router } from "express"
import sessionController from "../controllers/session.controller.js"

const router = Router()

router.post('/register', sessionController.register)
router.get('/failRegister', sessionController.failRegister)

router.get('/login', sessionController.loginPage)
router.post('/login', sessionController.login)
router.get('/failLogin', sessionController.failLogin)

router.get('/logout', sessionController.logout)

router.get('/github', sessionController.github)
router.get('/githubcallback', sessionController.githubCallback)

export default router
