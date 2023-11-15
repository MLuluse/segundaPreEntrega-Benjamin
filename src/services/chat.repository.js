const ChatRepository = (chatDao) => {
    const create = async (message) => await chatDao.create(message)
    const read =  async () => await chatDao.find()
    
    
    return{
        create,
        read,
    }
}
export default ChatRepository