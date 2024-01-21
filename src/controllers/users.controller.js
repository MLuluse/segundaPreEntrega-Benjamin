
import { UserService } from "../services/services.js"
import logger from "../utils/logger.js"

export const getAllUsersController = async(req, res) => {
    try{
        const users = await UserService.getAll()
        res.status(200).json({ status: "success", message: "Todos los user fueron obtenidos con éxito", payload: users })
    }catch (err) {
        logger.error("Error al obtener todos los usuarios", err.message)
        res.status(404).json({ error: err.message });
    }

}

export const updatedUserRoleController = async (req, res) => {
    try {
        const email = req.params.email;
        const user = await UserService.findUser(email)
        //console.log('user dentro de update', user)

        if (!user) {return res.status(404).json({error: "Usuario no encontrado"})}

       
        if (user.role === "admin") {
           return res.status(409).json({code: 1, error: "Usted es un administrador"}) 
        }

        const newRole = user.role === 'user' ? 'premium' : 'user'
        //console.log('newRole Print', newRole)

        const updatedUser = await UserService.findAndUpdate({_id: user._id}, {role: newRole})
        //console.log('Role user actualizado', updatedUser)
        
        res.status(201).json({ status: "success", message: "Rol de usuario actualizado con éxito", payload: updatedUser })

    } catch (err) {
        logger.error("Error al actualizar el rol del usuario", err.message)
        res.status(500).json({ error: err.message });
    }
}

export const uploadDocument = async (req, res) => {
    const userId = req.params.uid
    console.log('UID en uploader', userId)
    const documents = req.files 
    
    try {
      
      if (!documents || documents.length === 0) {
        return res.status(400).json({ error: 'No hay documento adjuntado.' });
      }
      //console.log('documents en upload', documents)
      
      const user = await UserService.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'No se encontro el usuario' });
      }
      console.log('user en uploads', user)

      const uploadDocToUser = await UserService.findAndUpdate(
        { _id: user._id },
        {$set: {
            documents: documents.map((document) => ({
              name: document.originalname,
              reference: `/uploads/documents/${document.filename}`,
            })),
          },
        }
      
      );


       //console.log('Upload del doc al user', uploadDocToUser)
      res.status(201).json({ message: 'Documentos subidos y usuario actualizado exitosamente', payload: { uploadDocToUser }})
     
    
    } catch (error) {
        logger.error('Error en la entrada al subir un documento', error.message)
      res.status(500).json({ error: 'Error al subir documentos o actualizar el usuario', error});
    }
  }


  export const deleteInactiveUsersController = async ( req, res) => {

  }

