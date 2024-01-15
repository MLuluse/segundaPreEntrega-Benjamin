import { Router } from "express";
import {updatedUserRoleController} from '../controllers/users.controller.js'

const router = Router()

router.get("/premium/:uid", updatedUserRoleController) 


export default router