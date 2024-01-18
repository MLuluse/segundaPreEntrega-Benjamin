import userModel from '../models/user.model.js'

const userDAO = {
    findOne : async (email) => {
        const userOne =  await userModel.findOne (email)
        return userOne
    },
    findById : async (id) => {
        const getById = await userModel.findById(id)
        return getById
    },

    create : async (data) => {
        const create = await userModel.create(data)
        return create
    },

    findAndUpdate : async(id, data) => {
        const findandupdate = await userModel.updateOne({_id: id}, data)
        return findandupdate
    }


}

export default userDAO