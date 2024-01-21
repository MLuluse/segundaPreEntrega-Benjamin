
import { UserService } from "../services/services.js"

export const getAllUsersController = async(req, res) => {
    const users = await UserService.getAll()
    res.json ({users})
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
        //logger.error("Error al actualizar el rol del usuario", err.message)
        res.status(500).json({ error: err.message });
    }
}

export const uploadDocument = async (req, res) => {
    const userId = req.params.uid
    console.log('UID en uploader', userId)
    const documents = req.files 

    try {
      
      if (!documents || documents.length === 0) {
        return res.status(400).json({ error: 'Archivos de documentos no proporcionados.' });
      }
      console.log('docuents en upload', documents)
      
      const user = await UserService.findById(userId);

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      console.log('user en uploads', user)

      const uploadDocToUser = await UserService.findAndUpdate(
        { _id: userId },
        {
          $set: {
            documents: documents.map((document) => ({
              name: document.originalname,
              reference: `/uploads/documents/${document.filename}`,
            })),
          },
        },
        { new: true } // Para devolver el documento actualizado
      );
        console.log('Upload del doc al user', uploadDocToUser)
      res.status(200).json({ message: 'Documentos subidos y usuario actualizado exitosamente', user: uploadDocToUser })
     
      
/*
      // Actualizar el estado del usuario y guardar los cambios
      user.documents = documents.map((document) => ({
        name: document.originalname,
        reference: `/uploads/documents/${document.filename}`,
      }));

      await UserService.save();

      // Responder con un mensaje de éxito y los detalles actualizados del usuario
      res.status(200).json({ message: 'Documentos subidos y usuario actualizado exitosamente', user });*/
    } catch (error) {
      res.status(500).json({ error: 'Error al subir documentos o actualizar el usuario' });
    }
  }


  export const deleteInactiveUsersController = async ( req, res) => {

  }

