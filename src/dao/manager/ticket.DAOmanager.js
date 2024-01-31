import ticketModel from '../models/ticket.model.js'

const ticketDAO = {
    findById : async (id) => {
        const getById = await ticketModel.findById(id).populate('products.product').lean()
        return getById
    },

    create : async (ticket) => {
        const createTicket = await ticketModel.create(ticket)
        return createTicket
    },

    printTicket : async () => {
        try{
        const ticket =  await ticketModel.find()
        return ticket
        }catch(err){
            return('Error al recibir los productos del print manager', err.message)
            }
    }
}

export default ticketDAO