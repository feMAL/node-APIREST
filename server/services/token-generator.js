//const conf = require('../conf/conf')
const jwt =  require('jsonwebtoken')

const tokengenerator = (data) => token = jwt.sign(data,process.env.SEED, {expiresIn: process.env.SEED_EXP})

module.exports = { tokengenerator }