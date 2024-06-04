import Users from "../dao/mongo/services/userManagerDB.js"
import Products from "../dao/mongo/services/productManagerDB.js"
import Carts from "../dao/mongo/services/cartManagerDB.js"
import Messages from "../dao/mongo/services/messageManagerDB.js"
import Tickets from "../dao/mongo/services/ticketManagerDB.js"

import UserRepository from "./usersRepository.js"
import ProductRepository from "./productsRepository.js"
import CartRepository from "./cartRepository.js"
import MessageRepository from "./messageRepository.js"
import TicketRepository from "./ticketRepository.js"

const usersService = new UserRepository(new Users())
const productsService = new ProductRepository(new Products())
const cartsService = new CartRepository(new Carts())
const messageService = new MessageRepository(new Messages())
const ticketService = new TicketRepository(new Tickets())

export { usersService , productsService, cartsService , messageService, ticketService}