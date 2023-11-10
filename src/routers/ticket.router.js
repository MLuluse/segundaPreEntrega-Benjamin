import {Router} from 'express'
import{createTicket, getTicket} from '../controllers/ticket.controller.js'

const router = Router()

router.post('/', createTicket)
router.get('/:tid',getTicket)

