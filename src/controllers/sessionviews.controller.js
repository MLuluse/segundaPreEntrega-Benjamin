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

export default sessionController