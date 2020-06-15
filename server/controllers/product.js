const Product = require('../models/product')

const getProduct = (req,res) => {
//populate : usuarios y categorias,
    let id = req.params.id

    Product.findById(id)
        .populate('categoria usuario','name')
        .exec((err,product)=>{
            if(err){
                return res.status(500).send({status : 'error', err })
            }
            if(!product){
                return res.status(404).send({status : 'error', err: 'el id buscado no existe' })
            }else{
                res.status(200).send({status:'ok', product})    
            }
        })
}

const getProducts = (req,res) => {
//trae todos los productos
//populate : usuarios y categorias,
//paginado
    let desde = req.query.desde || 0
    desde = Number(desde)

    Product.find({disponible:true})
        .skip(desde)
        .populate('usuario','name email')
        .populate('categoria', 'name description')
        .exec({},(err,products)=>{
            if(err){
                return res.status(500).send({status : 'error', err })
            }
            if(!products){
                return res.status(404).send({status : 'error', err: 'no hay productos definidos' })
            }else{
                res.status(200).send({status:'ok', products})
            }
        })
}

const createProduct = (req,res) => {
//grabar el usuario
//grabar categoria del listado
    let params = req.body

    let newProduct = new Product()

    newProduct.nombre      = params.name
    newProduct.precioUni   = params.price
    newProduct.descripcion = params.description
    newProduct.categoria   = params.category
    newProduct.usuario     = req.usuario._id


    newProduct.save(newProduct,(err,newprod)=>{
        if(err){
            return res.status(500).send({status : 'error', err })
        }
        res.status(200).send({status:'ok', product: newprod})
    })

}

const updateProduct = (req,res) => {
//grabar el usuario
//grabar categoria del listado
    let id = req.params.id
    let params = req.body
    params.usuario = req.usuario

    if(!id){
        return res.status(400).send({status : 'error', err: 'No ha enviado un id valido' })
    }

    Product.findById(id,(err,product)=>{
        if(err){
            return res.status(500).send({status : 'error', err })
        }
        if(!product){
            return res.status(404).send({status : 'error', err: 'el id enviado no existe' })
        }else{

            Product.findByIdAndUpdate(id,params,{ new:true, runValidators:true}, (err,updated)=>{
                if(err){
                    return res.status(500).send({status : 'error', err })
                }
                if(!updated){
                    return res.status(404).send({status : 'error', err: 'registro que intenta actualizar no ha sido encontrado' })
                }else{
                res.status(200).send({status : 'ok',  product: updated })
                }
            })
        }
    })
    
}

const deleteProduct = (req,res) => {
//grabar el usuario
//grabar categoria del listado    
//baja logica => disponible = false
    let id = req.params.id

    let params = { disponible: false }
    
    if(!id){
        return res.status(400).send({status : 'error', err: 'No ha enviado un id valido' })
    }

    Product.findByIdAndUpdate(id,params,{ new:true, runValidators:true}, (err,updated)=>{
        if(err){
            return res.status(500).send({status : 'error', err })
        }
        if(!updated){
            return res.status(404).send({status : 'error', err: 'registro que intenta eliminar no ha sido encontrado' })
        }else{
          res.status(200).send({status : 'ok',  productRemoved: updated._id })
        }
    })

}


module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
}