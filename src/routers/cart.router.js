//aca voy a tener que poner ruta POST (ID Y Y ARRAY DE PRODUCTS) GET (DEBERA DAR LOS PROD QUE ESTEN EN EL ID DE CARRITO)PUT
import { Router } from "express"; 
import CartManager from '../cartManager.js';



const router = Router() 
const cartManager = new CartManager('./data/cart.json')

// Ruta post que crea carrito
router.post('/', async(req, res) =>{
    const result = await cartManager.createCart() //aca llama al crear carrito
    //aca tiene que postear un nuevo carrito
    if (typeof result == 'string'){
        const error = result.split('')
        return res.status(404).json({status:'error', payload: error})
    }
    res.status(201).json({status: 'success', payload: result})
})

//ruta get que obtiene el carrito
router.get('/:cid', async (req, res) => {
//tiene que traer todo los productos dentro de ese carrito id 
   const cid = parseInt(req.params.cid)
   const result = await cartManager.getCartById(cid)
   if(typeof result =='string'){
    const error = result.split('')
    return res.status(404).json({status: 'error', payload:'El carrito no existe'})
   }
   res.status(200).json({status:'success', payload: result})
  })


//Ruta post que da producto y cantidad
router.post('/:cid/products/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    //const productData = req.body;

    const result = await cartManager.addProductsToCart(cartId, productId)
 
    
    if (typeof result === 'string') {
        const error = result.split('');
        return res.status(404).json({ status: 'error', payload: error });
    }

    res.status(200).json({ status: 'success', payload: result });
});


export default router 
