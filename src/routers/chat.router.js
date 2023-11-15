import{Router} from 'express'
import { chatController } from '../controllers/chat.controller.js'
import { handlePolices } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/', handlePolices(['USER']), chatController)  //este puede usarlo solo un user

export default router
