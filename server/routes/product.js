const express = require('express')

const productController = require('../controllers/product')

const { verifyToken,verifyRole } = require('../middlewares/middleware')

const api = express.Router()

api.get('/product', productController.getProducts)
api.get('/product/:id', productController.getProduct)
api.get('/product/search/:termino', productController.searchProduts)
api.post('/product', verifyToken, productController.createProduct)
api.put('/product/:id',verifyToken, productController.updateProduct)
api.delete('/product/:id',[ verifyToken, verifyRole ], productController.deleteProduct)

module.exports = api