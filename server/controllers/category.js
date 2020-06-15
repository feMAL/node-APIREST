const Category = require('../models/category')

const getCategories = (req,res) => {
    let limit = req.body.limit || 10

    Category.find({})
        .limit(limit).populate('createdBy','name email')
        .exec((err,categories)=>{
            if(err){
                return res.status(500).send({status : 'error', err })
            }
            return res.status(200).send({status : 'ok', categories })
        })
}

const getCategory = (req,res) => {
    let id_category = req.params.id

    if(!id){
        return res.status(400).send({status : 'error', err: 'La solicitud enviada no es correcta' })
    }

    Category.findById(id_category,(err,category_find)=>{
        if(err){
            return res.status(500).send({status : 'error', err })
        }
        if(!category_find){
            return res.status(200).send({status : 'ok', message: 'La categoria buscada es inexistente' })
        }else{
            return res.status(200).send({status : 'ok',  category: category_find })
        }

    })

}

const createCategory = (req,res) => {
    let params = req.body
    let newCategory = new Category()

    newCategory.name = params.name
    newCategory.description = params.description
    newCategory.createdBy = req.usuario

    newCategory.save((err,newCat)=>{
        if(err){
            return res.status(500).send({status : 'error', err })
        }
        return res.status(200).send({status : 'ok',  category: newCat })

    })
}

const updateCategory = (req,res) => {
    let id = req.params.id
    let body = req.body 

    Category.findByIdAndUpdate(id,body,{new:true,runValidators:true},(err,updated)=>{
        if(err){
            return res.status(500).send({status : 'error', err })
        }
        if(!updated){
            return res.status(404).send({status : 'error', err: 'registro que intenta actualizar no ha sido encontrado' })
        }else{
          res.status(200).send({status : 'ok',  category: updated })
        }
    })
}

const deleteCategory = (req,res) => {
    let id = req.params.id

    Category.findByIdAndRemove(id,(err,removed)=>{
        if(err){
            return res.status(500).send({status : 'error', err })
        }
        if(!removed){
            return res.status(404).send({status : 'error', err: 'La categoria que intenta eliminar no existe' })
        }else{
          res.status(200).send({status : 'ok',  categoryRemoved: removed })
        }
    })
}

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
}