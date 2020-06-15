const express = require('express')

const loginController=  require('../controllers/login')

let api = express.Router()

api.post('/login',loginController.singin);
api.post('/google',loginController.googleSingIn);

module.exports = api