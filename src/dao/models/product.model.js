import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

//nombre de la colecciòn
const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title: {type: String, required:true, unique: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    thumbnails: {type: [String], default:[]},
    code: {type: Number, required: true, unique: true},
    category: {type: String, require: true},
    status: {type: Boolean, default: true},
    stock: {type: Number, required: true},
    owner: { type: String, required: true, default: 'admin', ref: "users" }
})

//permite consultas menos estrictas en mongoose
mongoose.set('strictQuery', false);

//aca va el paginate (plugin)
productSchema.plugin(mongoosePaginate) 
const productModel = mongoose.model(productCollection, productSchema)

export default productModel