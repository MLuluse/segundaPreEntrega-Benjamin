import productDAO from '../dao/manager/product.DAOmanager.js'
import ProductRepository from './products.repository.js'
import userDAO from '../dao/manager/user.DAOmanager.js'
import UserRepository from './user.repository.js'
import cartDAO from '../dao/manager/cart.DAOmanager.js'
import CartRepository from './cart.repository.js'
import TicketRepository from './ticket.repository.js'
import ticketDAO from '../dao/manager/ticket.DAOmanager.js'
import ChatRepository from './chat.repository.js'
import chatDAO from '../dao/manager/chat.DAOmanager.js'
import PasswordRepository from './user-password.repository.js'
import userPasswordDAO  from '../dao/manager/user-pasword.DAOmanager.js'

export const ProductService =  ProductRepository(productDAO)
export const CartService = CartRepository(cartDAO)
export const UserService = UserRepository(userDAO)
export const TicketService = TicketRepository(ticketDAO)
export const ChatService =  ChatRepository(chatDAO)
export const PassResetService = PasswordRepository(userPasswordDAO)