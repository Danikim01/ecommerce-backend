import TicketDTO from "../dao/dto/ticketDTO.js";

export default class TicketRepository {
    constructor(dao){
        this.dao = dao;
    }
    async createTicket(purchaser,amount){
        const ticketDTO = new TicketDTO(purchaser,amount);
        return await this.dao.createTicket(ticketDTO);
    }
    async getUserTickets(purchaser){
        return await this.dao.getUserTickets(purchaser);
    }
}