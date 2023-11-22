import { Router } from "express";
import {generateProducts} from '../utils.js'

const router = Router()

router.get('/', async(req, res) =>{
    const products = []
    for(let index = 0; index < 100; index++){
        products.push(generateProducts())
    }
    res.send({status:'success', payload: products})
})

export default router