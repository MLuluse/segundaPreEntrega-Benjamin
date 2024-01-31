const TicketRepository = (ticketDao) => {
    const findTicket = async (id) => await ticketDao.findById(id)
    const printTicket = async () => await  ticketDao.printTicket()
    const createTicket = async (data) => await ticketDao.create(data)

    return{
        findTicket,
        printTicket,
        createTicket,
    }
}
export default TicketRepository