import UserDTO from "../dto/user.dto.js"

const sessionController = {}

sessionController.registerPage = async (req, res) => {
  res.render('sessions/register')
}

sessionController.loginPage = async (req, res) => {
  res.render('sessions/login')
}

sessionController.profile = (req, res) => {
  const userDTO = new UserDTO(req.session.user)
  res.render('sessions/profile', userDTO)
}

sessionController.forgetPass = (req, res) =>{
  res.render('sessions/forgetPassword')
}

sessionController.resetPass = (req, res) => {
  res.redirect(`/api/session/verify-token/${req.params.token}`)
}

sessionController.createUpdate = (req, res) => {
  res.render('createUpdate')
}

export default sessionController