const UserRepository = (userDao) => {
    const getAll = async () => await userDao.getAll()
    const findUser = async (mail) => await userDao.findOne(mail)
    const findById =  async (id) => await userDao.findById(id)
    const createUser = async (data) => await userDao.create(data)
    const findAndUpdate =  async (id, data) => await userDao.findAndUpdate(id, data)
    const eliminate = async (id) => await userDao.delete(id)
    const getAllInactive = async (date) => await userDao.getAllInactiveUsers(date)


    return{
        getAll,
        findUser,
        findById,
        createUser,
        findAndUpdate,
        eliminate,
        getAllInactive
    }
}
export default UserRepository