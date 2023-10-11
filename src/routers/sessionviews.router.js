//router para llevar a formunlario de login registro  o perfil
import {Router} from 'express'
import { privateRoutes, publicRoutes } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/register', async (req, res) => {

   res.render('sessions/register')
})

router.get('/', async (req, res) =>{
    res.render('sessions/login')
})

router.get('/profile',(req, res) => {
    res.render('sessions/profile', req.session.user)
})

export default router