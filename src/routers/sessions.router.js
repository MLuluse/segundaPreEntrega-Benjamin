//metodo de registro de usuario y su respectivo login
import { Router } from "express";
import userModel from '../dao/models/user.model.js'


const router = Router()

router.post('/register', async(req, res) =>{
    const newUser = req.body
    try{
      const existingUser = await userModel.findOne({email: newUser.email})
      if(existingUser){
         res.status(400).json({message:'El correo ya esta en uso'})
      }else{
         const user = await userModel.create(newUser)
      //el exito esta en el url
         res.redirect ('/?exito=Registo exitoso')

      }
    }catch(error){
      res.status(500).json({ message: `Hubo un error en el servidor ${error}`})

    }
})

router.post('/login', async(req, res) => {
   try{
   const {email, password} = req.body
       if(email === 'adminCoder@coder.com' && pasword === 'adminCod3r123')
           const adminUser = {
            email: 'adminCoder@coder.com',
            password: 'adminCod3r123',
            role: 'admin'
           }
       req.session.user = adminUser,
       return res.redirect('/products')
   }   
   const user = await userModel.findOne({email, password}).lean().exec()
   if(!user){
      //el error lo miestra en la url
      return res.redirect('/?error=Datos incorrectos')
   }
    
   user.role = 'user'
   req.session.user = user
   res.redirect('/products')
   }catch(error){
      res.status(500).json({message: `Hubo un error en el servidor ${error}`})
   }

router.get('/logout', (req, res) => {
   req.session.destroy(err => {
       if (err) {
         console.log(err);
      res.status(500).render('error', {error: err})
      }else res.redirect('/')
      }) 
   } )
})

export default router
