
import productModel from "../models/product.model.js"
import { getProductsFromDB } from "./getProductsFromDB.js"



export const getAll = async (req, res) => {
    try{
    const products = await getProductsFromDB(req, res)
    return products
    }catch(err){
    return('Error al recibir los productos del manager', err.message)
    }
} 

export const getProductsById = async (pid) =>{ 
    try{
    const product = await productModel.findById(pid).lean().exec()
    return product
    }catch(err){
        return('Error al recibir los productos por ID del manager', err.message)
        }
} 

export const createProduct = async (product) => {
    try{
    const newProduct = await productModel.create(product) 
    return newProduct
    }catch(err){
        return('Error al crear productos del manager', err.message)
        }
}

export const printProducts = async () => {
    try{
    const products =  await productModel.find().lean().exec()
    console.log(products)
    return products
    }catch(err){
        return('Error al recibir los productos del print manager', err.message)
        }
}

export const updateProduct = async ({id}, info) => {
    try{
    const prodactualizado = await productModel.updateOne({id},info)
    return prodactualizado
    }catch(err){
        return('Error al actualizar productos del manager', err.message)
        }
}

export const deleteProduct = async ({id}) => {
    try{
    const borrar =  await productModel.findOneAndDelete({id})
    return borrar
    }catch(err){
        return('Error al actualizar productos del manager', err.message)
    }
}

