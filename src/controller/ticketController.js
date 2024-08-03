import { ticketService } from "../repositories/index.js";


export default class TicketController {
    createTicket(purchaser,products,invalid_products){
        let amount = 0
        for (let product of products){
            if (product.product.stock < product.quantity){
                invalid_products.push(product.product.title)
            }else{
                amount += product.product.price * product.quantity
            }
        }

        return ticketService.createTicket(purchaser,amount);

    }

    getUserTickets(purchaser){
        return ticketService.getUserTickets(purchaser);
    }
}