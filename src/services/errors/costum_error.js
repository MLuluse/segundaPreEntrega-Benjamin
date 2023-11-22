export default class CustomError {   // este es el error customizado  en clase  
    static createError({ name="Error", cause, message, code }) {  // tiene un metodo create error
        const error = new Error(message, { cause })  // new error es propio de js
        error.name = name
        error.code = code
        throw error
    }
}