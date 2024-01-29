import passport from "passport";
import logger from "../utils/logger.js";
import { UserService, PassResetService } from "../services/services.js";
import { generateRandomCode } from '../utils/utils.js'
import { restorePasswordMail } from '../services/mail.service.js'
import bcrypt from 'bcrypt'
import { createHash } from "../utils/utils.js";



const sessionController = {};

sessionController.register = async (req, res) => {
  passport.authenticate('register', { failureRedirect: '/api/session/failRegister' })(req, res, () => {
    res.redirect('/');
  });
};

sessionController.failRegister = (req, res) => {
  res.send({ error: 'Passport register failed' });
};

sessionController.loginPage = (req, res) => {
  res.render('sessions/login');
};

sessionController.login = async (req, res) => {
  passport.authenticate('login', { failureRedirect: '/api/session/failLogin' })  (req, res, async () => {
    if (!req.user) {
      return res.status(400).send({ status: 'error', error: 'Invalid credentials' });
    }
  try{

    req.session.user = {
      id: req.user._id,
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      age: req.user.age,
      role: req.user.role,
      cart: req.user.cart,
    };

    res.redirect('/products');
  }
  catch(error){
    return res.status(500).send({ status: 'error', error: 'Error de servidor' })
  }
  })}

sessionController.failLogin = (req, res) => {
  res.send({ error: 'Passport login failed' });
};

sessionController.logout = async (req, res) => {
  try {
    await req.session.destroy();
    const user = req.user;

    if (user && user.role !== 'admin') {
      const lastConnectionLogOUT = await UserService.findAndUpdate(user._id, { last_connection: new Date() });
      //console.log('Ultima conexión', lastConnectionLogOUT)
    }
    res.redirect('/');
  } catch (err) {
    logger.error('Error al deslogearse en el controlador', err.message);
    res.status(500).render('error/base', { error: err });
  }
};
//Github
sessionController.github = passport.authenticate('github', { scope: ['user:email'] });

sessionController.githubCallback = async (req, res) => {
  passport.authenticate('github', { failureRedirect: '/login' })(req, res, async () => {
    try{
    req.session.user = req.user;
    res.redirect('/products')
  }catch(error){
    return res.status(500).send({ status: 'error', error: 'Error de servidor' })
  }
  });
};


sessionController.forgetPass =  async (req, res) => {
  const email = req.body.email
    const user = await UserService.findUser({ email })
    if (!user) {
        return res.status(404).json({ status: 'error', error: 'User not found' })
    }
    const token = generateRandomCode(16);
    await PassResetService.createToken({ email, token })
  //aca llamo al mail service
  const emailResult = await restorePasswordMail(email, token)
  if (emailResult.success) {
    res.status(200).json({ status: 'success', message: emailResult.message })
   } else {
    res.status(500).json({ status: 'error', error: emailResult.error })
   }


}

sessionController.verifyToken = async (req, res) => {
  const userPassword = await PassResetService.findToken({ token: req.params.token })
  if (!userPassword) {
      return res.status(404).json({ status: 'error', error: 'Token no válido / El token ha expirado' })
  }
  const user = userPassword.email
  res.render('sessions/resetPassword', { user })
}

sessionController.resetPass = async (req, res) => {
  try {
      const user = await UserService.findUser({ email: req.params.user })
    //console.log('user en reset', user)
      const newPassword = req.body.newPassword
      //comparacion pass
      const passwordMatch = bcrypt.compareSync(newPassword, user.password)
      if(passwordMatch){
        return res.status(404).json({ status: 'error', message: 'Contraseña igual a la anterior'})
      }
      await UserService.findAndUpdate(user._id, { password: createHash(newPassword) })
      res.json({ status: 'success', message: 'Se ha creado una nueva contraseña' })
      await PassResetService.deleteToken({ email: req.params.user })
  } catch(err) {
      res.json({ status: 'error', error: err.message })
  }
}
/*
sessionController.exchangeRole = async (req, res) => {
  try {
      const id = req.params.uid
      const user = await UserService.findById(id)
      //console.log('info de user',user)
      await UserService.findAndUpdate(req.params.uid, { role: user.role === 'user' ? 'premium' : 'user' })
      res.render('sessions/profile')
      //res.json({ status: 'success', message: 'Se ha actualizado el rol del usuario' })
  } catch(err) {
      res.json({ status: 'error', error: err.message })
  }
}*/

export default sessionController;
