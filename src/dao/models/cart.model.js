import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const cartCollection = 'carts'

const cartSchema = new mongoose.Schema({
    products:{
        type: [{
            _id:false,
            //aca la refe para que llame a los productos dentro del carrito
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products'
            },
        quantity: Number
        }],
        default: []
    }
})

mongoose.set('strictQuery', false);

cartSchema.plugin(mongoosePaginate)

const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel