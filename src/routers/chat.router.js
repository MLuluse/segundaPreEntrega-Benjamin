import{Router} from 'express'

const router = Router()

router.get('/chat', (req, res) => {
    res.render('chat', {}) //renderiza el chat.handlebars
})

export default router
