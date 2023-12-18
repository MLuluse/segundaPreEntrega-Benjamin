const UserRepository = (userDao) => {
    const findUser = async (mail) => await userDao.findOne(mail)
    const findById =  async (id) => await userDao.findById(id)
    const createUser = async (data) => await userDao.create(data)
    const findAndUpdate =  async (id, data) => await userDao.findAndUpdate(id, data)

    return{
        findUser,
        findById,
        createUser,
        findAndUpdate,
    }
}
export default UserRepository