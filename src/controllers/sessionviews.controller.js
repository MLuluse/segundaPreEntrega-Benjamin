const sessionController = {}

sessionController.registerPage = async (req, res) => {
  res.render('sessions/register')
}

sessionController.loginPage = async (req, res) => {
  res.render('sessions/login')
}

sessionController.profile = (req, res) => {
  res.render('sessions/profile', req.session.user)
}

export default sessionController