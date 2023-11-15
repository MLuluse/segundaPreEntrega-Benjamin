import chatModel from "../models/chat.model.js";

const chatDAO = {
    find: async () => {
        try {
            const messages = await chatModel.find().lean().exec();
            console.log(messages,'Verifica los mensajes recuperados'); 
            return messages;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    create: async (data) => {
        try {
            const createdMessage = await chatModel.create(data);
            console.log(createdMessage,'Verifica el mensaje creado'); 
            return createdMessage;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
};
export default chatDAO