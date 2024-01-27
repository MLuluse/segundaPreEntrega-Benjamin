export default class UserDTO {
    constructor(user) {
        //console.log('user dentro del constructor', user)
        this.id = user.id
        this.first_name = user.first_name
        this.email = user.email
        this.role = user.role
        this.cart = user.cart
        
    }
}