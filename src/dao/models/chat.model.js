import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const chatCollection = 'messages'

const chatSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    message: String
})

mongoose.set('strictQuery', false);
chatSchema.plugin(mongoosePaginate)
const chatModel = mongoose.model(chatCollection, chatSchema)

export default chatModel