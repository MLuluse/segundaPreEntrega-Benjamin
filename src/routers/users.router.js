import { Router } from "express";
import {updatedUserRoleController, uploadDocument, deleteInactiveUsersController, getAllUsersController, deleteUserByIdController} from '../controllers/users.controller.js'
import { uploader } from "../utils/utils.js";

const router = Router()

router.get("/", getAllUsersController)

router.get("/premium/:uid", updatedUserRoleController)

router.post("/:uid/documents", uploader.fields([{name: 'profileImage'}, {name:'productImage'}, {name:'documents'}, {name:'bankStatementDocument'}, {name: 'addressProofDocument'}, {name: 'identificationDocument'}]), uploadDocument)

router.delete("/inactiveusers", deleteInactiveUsersController)

router.delete("/:uid", deleteUserByIdController)


export default router