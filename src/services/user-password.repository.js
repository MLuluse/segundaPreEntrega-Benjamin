const PasswordRepository = (userPasswordDAO) => {
    const createToken = async (email, token) => await userPasswordDAO.create(email, token)
    const findToken = async (token) => await userPasswordDAO.findOne(token)
    const deleteToken = async (id) => await userPasswordDAO.deleteOne(id)

    return{
        createToken,
        findToken,
        deleteToken,
    }
}

export default PasswordRepository