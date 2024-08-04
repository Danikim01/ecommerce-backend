import ticketModel from "../models/ticketModel.js";

export default class TicketManagerDB {
    async createTicket(ticketDTO){
        try{
            const ticket = await ticketModel.create({purchaser:ticketDTO.purchaser,amount:ticketDTO.amount})
            return ticket
        }catch(error){
            console.error(error)
            throw new Error("Error al crear el ticket")
        }
    }

    async getUserTickets(purchaser){
        try{
            let userTickets = await ticketModel.find({purchaser:purchaser}).lean()
            return userTickets
        }catch(error){
            console.error(error)
            throw new Error("Error al buscar los tickets del usuario")
        }
    }
}