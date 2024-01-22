import { Router } from "express";
import {updatedUserRoleController, uploadDocument, deleteInactiveUsersController, getAllUsersController} from '../controllers/users.controller.js'
import { uploader } from "../utils/utils.js";

const router = Router()

router.get("/", getAllUsersController)

router.get("/premium/:uid", updatedUserRoleController)

router.post("/:uid/documents", uploader.array('documents',3),  uploadDocument)

router.delete("/", deleteInactiveUsersController)


export default router