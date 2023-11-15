const TicketRepository = (ticketDao) => {
    const findTicket = async (id) => await ticketDao.findById(id)
    const printTicket = async () => await  ticketDao.printTicket()
    const updateTicket =  async (id) => await ticketDao.update(id)
    const createTicket = async (data) => await ticketDao.create(data)

    return{
        findTicket,
        updateTicket,
        printTicket,
        createTicket,
    }
}
export default TicketRepository