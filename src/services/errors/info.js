//consologuea la explicacion del error, que es lo que falta...
export const generateErrorInfo = product => {
    return `
    Uno o mas properties están incompletos o son inválidos.
    Lista de propiedades obligatorias:
    - title: Must be a String. (${product.title})
    - description: Must be a String. (${product.description})
    - price: Must be a Number. (${product.price})
    - code: Must not repeat the code. (${product.code})
    - category: Must be a  String. (${product.category})
    - stock: Must be a Number. (${product.stock})
    - thumbnail: Must be an Array. (${product.thumbnail})
    `
}