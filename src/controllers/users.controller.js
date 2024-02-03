
import { UserService } from "../services/services.js"
import logger from "../utils/logger.js"
import AllUsersDTO from "../dto/allUsers.dto.js"
import { UserDeleted } from "../services/mail.service.js" 


export const getAllUsersController = async(req, res) => {
    try{
        const users = await UserService.getAll()
        const allUsers = new AllUsersDTO(users)
        //console.log('para ver los documents', allUsers)
        res.status(200).json({ status: "success", message: "Todos los user fueron obtenidos con éxito", payload: allUsers })
    }catch (err) {
        logger.error("Error al obtener todos los usuarios", err.message)
        res.status(404).json({ error: err.message });
    }

}

export const updatedUserRoleController = async (req, res) => {
    try {
        const  uid= req.params.uid;
        //console.log('user ID', uid)
        const user = await UserService.findById(uid)
        //console.log('user dentro de update', user)
        let newRole
       
        if (!user) {return res.status(404).json({error: "Usuario no encontrado"})}

        if (user.role === "admin") {
           return res.status(409).json({code: 1, error: "Usted es un administrador"}) 
        }

        const documentos = user.documents
        let nombresSinExtention = []
        documentos.forEach(documento => {
          const nombreDocumento = documento.name
          const partesNombre = nombreDocumento.split('.')
          const nombreSinExtention = partesNombre[0]
          nombresSinExtention.push(nombreSinExtention)
        })
        console.log('nombres de documentos sin extenciones', nombresSinExtention)
        const valoresNecesarios = ['identificationDocument', 'addressProofDocument','bankStatementDocument']

        if (user.role === 'user' && (valoresNecesarios.every(valor => nombresSinExtention.includes(valor)))) {
          newRole = 'premium'
        } else if (user.role === 'premium') {
          newRole = 'user';
        } else {
          console.log("Falta cargar algun dato")
          return res.status(400).json({ error: "El usuario no ha terminado de procesar su documentación" })
        }
        console.log('newRole Print', newRole)
        const updatedUser = await UserService.findAndUpdate(user._id, {role: newRole})
        res.status(201).json({ status: "success", message: "Rol de usuario actualizado con éxito", payload: updatedUser })

    } catch (err) {
        //logger.error("Error al actualizar el rol del usuario", err.message)
        res.status(500).json({ error: err.message })
    }
}

export const uploadDocument = async (req, res) => {
  const userId = req.params.uid
  const user = await UserService.findById(userId)
  const documents = req.files
  //console.log('esto es el req.file', documents)

  function getNewDocumentFileName(documentType, originalName) {
    switch (documentType) {
        case 'identificationDocument':
            return 'identificationDocument'
        case 'addressProofDocument':
            return 'addressProofDocument'
        case 'bankStatementDocument':
            return 'bankStatementDocument'
        default:
            return originalName
    }
}
  try {
      if (!documents || documents.length === 0) {
          return res.status(400).json({ error: 'No hay documento adjuntado.' })
      }
      if (!user) {
          return res.status(404).json({ error: 'No se encontro el usuario' })
      }
      const uploadedDocuments = [];
      for (const fieldName in documents) {
          const documentType = fieldName;
          const newFileName = getNewDocumentFileName(documentType, documents[fieldName][0].originalname);
          const newDocument = {
              name: newFileName,
              reference: documents[fieldName][0].destination
          }

          uploadedDocuments.push(newDocument)
      }
       //console.log('uploadedDocuments en controller', uploadedDocuments)

      const uploadDocToUser = await UserService.findAndUpdate({ _id: user._id },{ $push: { documents: { $each: uploadedDocuments } } }, { new: true })

      res.status(201).json({ message: 'Documentos subidos y usuario actualizado exitosamente', payload: uploadDocToUser})
  } catch (error) {
      console.error('Error en la entrada al subir un documento', error.message);
      res.status(500).json({ error: 'Error al subir documentos o actualizar el usuario', error });
  }
};

  export const deleteInactiveUsersController = async ( req, res) => {
    try{
      const currentDate = new Date()
      //console.log('current date', currentDate)
      const limitDate = new Date(currentDate)
      limitDate.setDate(currentDate.getDate() - 2)
      //console.log('limite de fecha', limitDate)

      const inactiveUsers = await UserService.getAllInactive(limitDate)
      if (inactiveUsers.length === 0) {
        res.status(204).json({ success: true, message: 'No hay usuarios inactivos para eliminar.'})
      }else{
        for (const user of inactiveUsers) {
          //aca llamo al mail service y elimino
          await UserDeleted(user.email)
          await UserService.eliminate(user._id)
        }
    
        res.status(200).json({ success: true, message: 'Usuarios Inactivos Borrados y notificados' })
      }
      console.log('usuarios Inactivos en 48 hs', inactiveUsers)


    } catch (error) {
      res.staus(500).json({status:'error', error: 'Algo salió mal en la eliminación del User Inactivo'})
  }
  }
  
  export const deleteUserByIdController = async (req, res) => {
    try{
      const uid = req.params.uid

      const user = await UserService.findById(uid)
      if(!user) return res.status(404).json({status:'error', error: 'Usuario no encontrado en DB'})

      await UserService.eliminate(user._id)

      res.status(201).json({status: 'success', message: 'El usuario se elimino con éxito'})

    }catch(error){
    res.status(500).json({status:'error', error: 'Algo salió mal en la eliminación del un User'})
    }
  }
