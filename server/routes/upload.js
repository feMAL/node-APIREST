const express = require('express')
const fileUpload = require('express-fileupload')
const fs = require('fs')
const path = require('path')

const User = require('../models/users')
const Product = require('../models/product')

const app = express()

app.use(fileUpload())

//==========================
//Methods of UploadRoute
//==========================
app.put('/upload/:type/:id', (req,res)=>{

    let type = req.params.type
    let id = req.params.id

    if(!req.files){
        return res.status(400).send({status:'error', err: 'No ha enviado archivos'})
    }
    //Valid Type
    let validType = ['products','users']
    if( !validType.includes(type)){
        return res.status(400).send({status: 'err', message:`No ha enviado tipo valido. Los Tipos permitidos son: ${validType}`});
    }



    //Files for Uploads
    let file =  req.files.file
    // Flag  File IsValid ?
    let validation = fileValidations(file)
    
    if(validation.isValid){
        let newName = `${id}-${validation.newName}`

        file.mv(`uploads/${type}/${newName}`, (err)=>{
            if(err){
                return res.status(500).send({status: 'err', err});
            }

            if(type=='users'){
                setImageUser(id, res, newName)
            }else{
                setImageProduct(id,res, newName)
            }
            // Setear imagen en el usuario
            
        })
    }else{
        return res.status(400).send({status: 'err', message:'No ha enviado un archivo valido'});
    }
    
})

//==========================
//Private Functions () => {}
//==========================
const setImageUser = (id, res, file_name) => {
    User.findById(id,(err,user)=>{
        if(err){
            deleteFiles('users',file_name)
            return res.status(500).send({status: 'err', err});
        }
        if(!user){
            deleteFiles('users',file_name)
            return res.status(200).send({ status: 'err', message:'el id del usuario a modificar no existe'})
        }else{
            
            deleteFiles('users',user.img)

            user.img = file_name
            user.save((err,saveUser)=>{
                if(err){
                    return res.status(500).send({status: 'err', err});
                }
                res.status(200).send({ status: 'ok', saveUser, img: file_name})
            })
        }
        
    })
}

const setImageProduct = (id, res, file_name) => {
    Product.findById(id,(err,product)=>{
        if(err){
            deleteFiles('products',file_name)
            return res.status(500).send({status: 'err', err});
        }
        if(!product){
            deleteFiles('products',file_name)
            return res.status(200).send({ status: 'err', message:'el id del usuario a modificar no existe'})
        }else{
            
            deleteFiles('products',product.img)

            product.img = file_name
            product.save((err,saveProduct)=>{
                if(err){
                    return res.status(500).send({status: 'err', err});
                }
                res.status(200).send({ status: 'ok', saveProduct, img: file_name})
            })
        }
    })
}

const fileValidations = (file) => {
    //Validations resorses
    let ext_valid = ['png','jpg','gif', 'jpeg']
    let response = {}
    response.isValid = false 


    let file_name = file.name.split('.')    //Sliteo el nombre de mi archivo para obtener la extension

    console.log(file_name)

    //Validation Process
    if(file_name.length>1){
        //Obtengo el ultimo elemento del Array (Extension del archivo)
        let element = file_name[file_name.length-1]     
        //Valido si La "extension del archivo" se encuentra en el array de "Extensiones validas"
        if(ext_valid.includes(element)){
            response.isValid = true
            response.newName = `${ new Date().getMilliseconds()}.${element}`
        }
    }

    return response
}

function deleteFiles(type,namefile){
    let pathImage = path.resolve(__dirname,`../../uploads/${type}/${namefile}`)

    if(fs.existsSync(pathImage)){
        fs.unlinkSync(pathImage)
    }
}

module.exports = app