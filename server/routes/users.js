const express = require('express')

const userController = require('../controllers/users')

const { verifyToken, verifyRole } = require('../middlewares/middleware')

let api = express.Router()

/* Solicitudes posibles */ 

api.get('/user/:id?', [verifyToken, verifyRole], userController.getUser);
api.put('/user/:id', [verifyToken, verifyRole], userController.updateUser);
api.post('/user', userController.saveUser)
api.delete('/user/:id', [verifyToken, verifyRole], userController.deleteUser)

module.exports = api;