import bcrypt from 'bcrypt'
import {fakerES as faker} from '@faker-js/faker'

//helper function --> esta es la que combierte la contraseña en otro texto (hash) 
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(15))

//helper function---> esta sirve para loguear una usuario... compara la contraseña
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)
 
//generador de CODIGO ALEATORIO PARA TICKET
export const generateRandomCode = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}

//Mock de producto con faker
export const generateProducts = () => {

    return{
        title:faker.commerce.product(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price({ min: 100, max: 200 }),
        thumbnails: [faker.image.dataUri()],
        code: faker.number.int(),
        category: faker.commerce.department(),
        status: faker.datatype.boolean(),
        stock: faker.number.int(50),
    }
}