import userModel from '../models/user.model.js'

const userDAO = {
    getAll : async () => {
        const allUsers = await userModel.find().lean().exec()
        return allUsers
    },
    findOne : async (email) => {
        const userOne =  await userModel.findOne (email)
        return userOne
    },
    findById : async (id) => {
        const getById = await userModel.findById(id).lean().exec()
        return getById
    },

    create : async (data) => {
        const create = await userModel.create(data)
        return create
    },

    findAndUpdate : async(id, data) => {
        const findandupdate = await userModel.updateOne({_id: id}, data)
        return findandupdate
    },

    delete : async (id) => {
        const UsersBorrados = await userModel.findByIdAndDelete(id)
        return UsersBorrados
    },
    
    getAllInactiveUsers : async (data) => {
        const InactiveUser = await userModel.find({ last_connection: { $lt: data } })
        return InactiveUser
    }

}

export default userDAO