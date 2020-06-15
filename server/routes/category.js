const express = require('express')

const categoryController = require('../controllers/category')

const { verifyToken,verifyRole } = require('../middlewares/middleware')

const api = express.Router()

api.get('/category', categoryController.getCategories)
api.get('/category/:id', categoryController.getCategory)
api.post('/category', verifyToken, categoryController.createCategory)
api.put('/category/:id',verifyToken, categoryController.updateCategory)
api.delete('/category/:id',[ verifyToken, verifyRole ], categoryController.deleteCategory)

module.exports = api