const ProductRepository = (dao) => {
    const getAll = async () => await dao.getAll();
    const getById = async (id) => await dao.getProductsById(id);
    const getAllPaginate = async (req, PORT) => await dao.getProductsPaginate(req, PORT);
    const create = async (product) => await dao.createProduct(product);
    const printProducts = async () => await dao.printProducts()
    const update = async (id, data) => await dao.updateProduct(id, data);
    const remove = async (id) => await dao.deleteProduct(id);
  
    return {
      getAll,
      getById,
      getAllPaginate,
      create,
      printProducts,
      update,
      remove,
    };
  };
  
  export default ProductRepository;