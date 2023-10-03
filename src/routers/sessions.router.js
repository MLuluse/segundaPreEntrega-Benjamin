//metodo de registro de usuario y su respectivo login
import { Router } from "express";
import userModel from '../dao/models/user.model.js'


const router = Router()

router.post('/register', async(req, res) =>{

console.log('Recibiendo solicitud POST en /api/sessions/register' )
    const newUser = req.body
    const user = await userModel.create(newUser)
    console.log(user)
    res.redirect ('/')

})

router.post('/login', async(req, res) => {
   const {email, password} = req.body
   const user = await userModel.findOne({email, password}).lean().exec()
   console.log(user)
  
   if(!user){
      return res.redirect('/')
   }
   if(user.email === 'adminCoder@coder.com' && user.password === 'adminCod3r123'){
      user.role = 'admin'
   }else{
      user.role = 'user'
   }

   req.session.user = user
   res.redirect('/products')


router.get('/logout', (req, res) => {
   req.session.destroy(err => {
       if (err) return res.send('Logout error')
       return res.redirect('/')
      }) 
   } )
})

export default router
