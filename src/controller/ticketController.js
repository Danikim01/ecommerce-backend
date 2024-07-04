import { ticketService } from "../repositories/index.js";


export default class TicketController {
    createTicket(purchaser,products){
        let invalidProducts = false
        let filteredProducts = []
        let InvalidProducts = []
        let amount = 0
        for (let product of products){
            if (product.product.stock <= product.quantity){
                InvalidProducts.push(product)
                invalidProducts = true
            }else{
                filteredProducts.push(product)
                amount += product.product.price * product.quantity
            }
        }
        if(invalidProducts == true){
            return InvalidProducts
        }else{
            return ticketService.createTicket(purchaser,amount);
        
        }
    }

    getUserTickets(purchaser){
        return ticketService.getUserTickets(purchaser);
    }
}