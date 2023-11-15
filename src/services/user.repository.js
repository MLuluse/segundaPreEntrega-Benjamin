const UserRepository = (userDao) => {
    const findUser = async (mail) => await userDao.findOne(mail)
    const findById =  async (id) => await userDao.findById(id)
    const createUser = async (data) => await userDao.create(data)

    return{
        findUser,
        findById,
        createUser,
    }
}
export default UserRepository