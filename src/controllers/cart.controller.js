import { ProductService } from '../services/services.js'
import { CartService } from '../services/services.js'
import { TicketService } from '../services/services.js'
import { generateRandomCode } from '../utils/utils.js'
import { sendTicketByEmail } from '../services/mail.service.js'
import logger from '../utils/logger.js'


export const createCartController = async(req, res) => {
    try{
    const result = await CartService.create({})
    res.status(201).json({status:'success', payload: result})
    }catch(err){
        logger.error("Error al crear el carrito:", err.message)
     res.status(500).json({ status: 'error', error: err.message })
    }
}

export const getCartByIdController = async (req, res) => {
    try{
        const result = await CartService.getProductsFromCart(req, res)
        res.status(200).json({status: 'success', payload: result})
    }catch(err){
        logger.error("Error en el id del carrito:", err.message)
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const postProductAndQuantityOnCartIdController = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const cartToUpdate = await CartService.findCartById(cid)
    try {
        //console.log(`este es el console de cart add ${cartToUpdate}`)
        if (cartToUpdate === null) {
            return res.status(404).json({ status: 'error', error: `Carrito con id=${cid} no encontrado` })
        }   
        const productToAdd = await ProductService.getById(pid)
        //console.log(`este es el console de producto add ${productToAdd}`)
   
        if (productToAdd === null) {
            return res.status(404).json({ status: 'error', error: `Producto con id=${pid} no encontrado` })
        }
        //cheuqueo que el que va a agregar no sea el owner
        if (productToAdd.owner === req.session.user.email){
            return res.status(400).json ({status:error, error: 'Como usuario Premium, no tiene permisos para agregar productos que usted mismo creo'})
        } 

        const productIndex = cartToUpdate.products.findIndex(item => item.product == pid)
        if ( productIndex > -1) {
            cartToUpdate.products[productIndex].quantity += 1
        } else {
            cartToUpdate.products.push({product: pid, quantity: 1})
        }
        const result = await CartService.update(cid, cartToUpdate, { returnDocument: 'after' })
       //console.log(`este es el console de result findandupdate add ${result}`)
        res.status(201).json({ status: 'success', payload: result })
    } catch(err) {
        logger.error('Error al postear un producto al carrito', err.message)
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const deleteProductFromCartController = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    try{
        //verifico si existe el carrito
        const cartWhereToDelete = await CartService.findCartById(cid)
        if(!cartWhereToDelete){
            return res.status(404).json({ status: 'error', error: `El carrito con el id: ${cid} no se encontro` })
        }
        //verfico si exite el producto
        const productToDelete =  await ProductService.getById(pid)
        if(!productToDelete){
        return res.status(404).json({ status: 'error', error: `El producto con id: ${pid} no encontrado` })
        }
        // verifica si existe en el carrito
        const existInCart = cartWhereToDelete.products.findIndex((product) => product.products == pid)
        if(!existInCart){
            return res.status(404).json({ status: 'error', error: 'El producto no existe en el carrito' })
        }else{
            cartWhereToDelete.products.splice(existInCart, 1)
            await cartWhereToDelete.save();
            return res.status(200).json({ status: 'success', message: 'Producto eliminado del carrito', payload: cartWhereToDelete.products });
        }

    }catch(err){
        logger.error("Error al borrar un producto del carrito", err.message)
        res.status(500).json({status: 'error', error: err.message})
    }

}

export const updateCartController = async (req, res) => {
    const cid = req.params.cid
    try{
    const cartToUpdate =  await CartService.findCartById(cid)
    if(!cartToUpdate){
        return res.status(404).json({ status: 'error', error: `El carrito con el id: ${cid} no se encontro` })
    }
    const products = req.body.products
        //start: validaciones del array enviado por body
        if (!products) {
            return res.status(400).json({ status: 'error', error: 'Field "products" is not optional' })
        }
        for (let index = 0; index < products.length; index++) {
            if (!products[index].hasOwnProperty('product') || !products[index].hasOwnProperty('quantity')) {
                return res.status(400).json({ status: 'error', error: 'product must have a valid id and a valid quantity' })
            }
            if (typeof products[index].quantity !== 'number') {
                return res.status(400).json({ status: 'error', error: 'product\'s quantity must be a number' })
            }
            if (products[index].quantity === 0) {
                return res.status(400).json({ status: 'error', error: 'product\'s quantity cannot be 0' })
            }
            const productToAdd = await getProductsById(products[index].product)
            if (productToAdd === null) {
                return res.status(400).json({ status: 'error', error: `Product with id=${products[index].product} doesnot exist. We cannot add this product to the cart with id=${cid}` })
            }
        }
        //end: validaciones del array enviado por body
        cartToUpdate.products = products
        const result = await findAndUpdate(cid, cartToUpdate, { returnDocument: 'after' })
        res.status(200).json({ status: 'success', payload: result })
    } catch(err) {
        logger.error("Error al actualizar el carrito", err.message)
        res.status(500).json({ status: 'error', error: err.message })
    }

}

export const updateProductFromCartController = async (req, res) => {
    const cid = req.params.cid
    const pid = req.params.pid
    const newQuantity = req.body.quantity
    try{
        //veo si exite el carrito
        const cartToUpdate = await CartService.findCartById(cid)
        if(!cartToUpdate){
            return res.status(404).json({ status: 'error', error: `El carrito con el id: ${cid} no se encontro` })}

        //veo si existe el producto en el carrito
        const productInCart = cartToUpdate.products.find((product) => product.product ==pid)
        if(!productInCart){
            return res.status(404).json({ status: 'error', error: `El producto con el id: ${pid} no se encontro` })}
        // si existe el producto mando la cantidad
        productInCart.quantity = newQuantity;
        await cartToUpdate.save();

        const payload = {
            product: pid,
            newQuantity: newQuantity
        };
        return res.status(200).json({ status: 'success', message: 'Cantidad del producto actualizada en el carrito', payload });

    }catch(err){
        logger.error("Error al actualizar la cantidad en el carrito", err.message)
        res.status(500).json({status: 'error', error: err.message})
    }

}

export const deleteCartController = async (req, res) => {
    const cid = req.params.cid;
    try {
        const cartToDelete = await CartService.findCartById(cid)
        if (!cartToDelete) {
            logger.erro('no se encontro el carrito con ese id', cid)
            return res.status(404).json({ status: 'error', error: `El carrito con el id: ${cid} no se encontro` })
        }

        // Borrar todos los productos del carrito
        cartToDelete.products = []

        logger.info("Se ha borrado un carrito", cartToDelete)
        // Guardar los cambios en el carrito en la base de datos
        const result = await cartToDelete.save()
        
        return res.status(200).json({ status: 'success', payload: result})
    } catch (err) {
        logger.error("Error al borrar el carrito", err.message)
        res.status(500).json({ status: 'error', error: err.message })
    }
}

export const purchaseCartController = async (req, res) => {
    const cid = req.params.cid;

    try {
        const cart = await CartService.findCartById(cid)
        if (!cart) {
            return res.status(404).json({ status: 'error', error: `El carrito con el id: ${cid} no se encontró` });
        }
        if (cart.products.length === 0) {
            return res.status(400).json({ status: 'error', error: 'El carrito está vacío. No se puede realizar la compra.' })
        }

        let productsToTicket = []
        let productsInCartAfterBuy = []
        let amount = 0
        //stock
        for (const item of cart.products) {
            const product = await ProductService.getById(item.product)
            //console.log(product,'dentrot de aca product')
            if (!product) {
                return res.status(404).json({ status: 'error', error: `Producto con id: ${item.product} no encontrado` })
            }
            if (item.quantity <= product.stock) {   
                const newstock = (product.stock -= item.quantity)
                //console.log(newstock, 'nuevo stock');
                //console.log('id del producto', product._id)
                await ProductService.update({_id: product._id}, {stock: newstock})
                
                amount += product.price * item.quantity;
                // Agregar el producto al ticket 
                productsToTicket.push({
                    product: product._id,
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    quantity: item.quantity,
                })

            //console.log(productsToTicket, 'despues del productstotick')
            } else {
                // No hay suficiente stock, dejar el producto en el carrito
                productsInCartAfterBuy.push(item);
            }
        }
            const ticket = await TicketService.createTicket({
            code: generateRandomCode(10), 
            products: productsToTicket,
            amount,
            purchaser: req.session.user.email 
        })
        // Carrito despues de la compra
        cart.products = productsInCartAfterBuy
        await cart.save()

        // Envío de correo electrónico después de guardar el carrito
        const emailResult = await sendTicketByEmail(req.session.user.email, ticket)
        //console.log('console de ticket', ticket)
        //console.log('console de ticket.products', ticket.products)

        res.status(200).json({ status: 'success', payload: ticket, message: emailResult.message})
    } catch (err) {
        logger.error('Error al intentar termianar la compra', cid)
        res.status(500).json({ status: 'error', error: err.message })
    }
}


 