import chatModel from "../dao/models/chat.model.js";

export const chatController = async (req, res) =>{
    const messages = await chatModel.find().lean().exec()
    const user = req.session.user
    res.render('chat', {messages, user})
}