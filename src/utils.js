import bcrypt from 'bcrypt'

//helper function --> esta es la que combierte la contraseña en otro texto (hash) 
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(15))

//helper function---> esta sirve para loguear una usuario... compara la contraseña
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)