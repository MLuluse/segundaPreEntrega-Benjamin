//metodo de registro de usuario y su respectivo login
import { Router } from "express";
import passport from "passport";

const router = Router()

//API para crar usuario en db
router.post('/register', 
passport.authenticate('register', {failureRedirect: '/api/session/failRegister'}), //este es el middleware
async(req, res) => {
    res.redirect('/')
})

router.get('/failRegister', (req, res) => res.send({ error: 'Passport register failed' }))// aca se crea la ruta de failRegister

//sessions da a la vista 
router.get('/login', (req, res) => {
    res.render('sessions/login')
})

//API para login
router.post('/login', passport.authenticate('login', {failureRedirect: '/api/session/failLogin'}), async (req, res) => {
   if (!req.user) {
       return res.status(400).send({ status: 'error', error: 'Invalid credentials' })
   }
   req.session.user = {
       first_name: req.user.first_name,
       last_name: req.user.last_name,
       email: req.user.email,
       age: req.user.age,
       role: req.user.role,
       cart: req.user.cart
   }
   res.redirect('/products')
})

router.get('/failLogin', (req, res) => res.send({ error: 'Passport login failed' }))


router.get('/logout', (req, res) => {
   req.session.destroy(err => {
       if (err) {
         console.log(err);
      res.status(500).render('error/base', {error: err})
      }else res.redirect('/')
      }) 
   } )

router.get('/github', passport.authenticate('github', {scope:['user:email']}), (req, res) => { })  //email lo tomo como usuario


router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), async(req, res) => {
    console.log('Callback: ', req.user)
    req.session.user = req.user
    res.redirect('/products')
})

export default router
