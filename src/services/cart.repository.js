const CartRepository = (cartDao) => {
    const getProductsFromCart = async (req, res) => await cartDao.getProductsFromCart(req, res)
    const getById = async (id) => await cartDao.getCartById(id)
    const findCartById = async (id) => await cartDao.findCartById(id)
    const create = async () => await cartDao.createCart()
    const update = async (id, data) => await cartDao.findAndUpdate(id, data)
    const clearCart = async(id) => await cartDao.clearProductsFromCart(id)

  
    return {
      getProductsFromCart,
      getById,
      findCartById,
      create,
      update,
      clearCart,
    }
  }
  
  export default CartRepository