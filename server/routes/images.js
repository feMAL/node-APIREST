const express = require('express')
const { verifyTokenImg } = require('../middlewares/middleware')

const fs = require('fs')
const path = require('path')

const User = require('../models/users')
const Product = require('../models/product')

const app = express()

app.get('/images/:type/:img',verifyTokenImg,(req,res)=>{

    let tipo = req.params.type
    let img = req.params.img

    
    let path_img = path.resolve(__dirname,`../../uploads/${tipo}/${img}`)

    console.log(path_img)

    if(fs.existsSync( path_img ) ) {
        res.sendFile( path_img )
    }else{
        let path_noimg = path.resolve(__dirname,'../assets/original.jpg' )
        res.sendFile( path_noimg )
    }

})

module.exports = app