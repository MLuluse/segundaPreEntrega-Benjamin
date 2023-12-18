import UserPasswordModel from '../models/user-password.model.js'

const userPasswordDAO = {

    create : async (email, token) => {
        const createToken = await UserPasswordModel.create(email, token)
        return createToken
    },

    findOne : async (token) => {
        const user =  await UserPasswordModel.findOne(token)
        return user
    },

    deleteOne : async (id) => {
        const updateTicket = await UserPasswordModel.deleteOne(id)
    }
}

export default userPasswordDAO