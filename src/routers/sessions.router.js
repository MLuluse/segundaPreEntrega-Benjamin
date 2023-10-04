//metodo de registro de usuario y su respectivo login
import { Router } from "express";
import userModel from '../dao/models/user.model.js'


const router = Router()

router.post('/register', async(req, res) =>{
    const newUser = req.body
    const user = await userModel.create(newUser)
    console.log(user)
    res.redirect ('/')
})

router.post('/login', async(req, res) => {
   const {email, password} = req.body
   const user = await userModel.findOne({email, password}).lean().exec()
  
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
       if (err) {
         console.log(err);
      res.status(500).render('error', {error: err})
      }else res.redirect('/')
      }) 
   } )
})

export default router
