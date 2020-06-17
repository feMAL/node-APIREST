const jwt = require ('jsonwebtoken')

const verifyToken = (req,res,next ) => {

    let token = req.get('token')

    if(!token){
        return res.status(401).send({status:'error', message:'solicitud no autorizada'})    
    }else{
        jwt.verify(token, process.env.SEED, (err,decode)=>{
            if(err){
                return res.status(401).send({status:'error', message:'solicitud no autorizada'})    
            }else{
                req.usuario = decode.user
                next()
            }
        })
    }
}

const verifyRole = (req,res,next) => {
    let user = req.usuario

    if(user.role == 'ROLE_ADMIN'){
        next()
    }else{
        return res.status(401).send({status:'error', message:'Requiere privilegios para acceder a este modulo.'})    
    }
}

const verifyTokenImg = (req,res,next ) => {

    let token = req.query.token

    if(!token){
        return res.status(401).send({status:'error', message:'solicitud no autorizada'})    
    }else{
        jwt.verify(token, process.env.SEED, (err,decode)=>{
            if(err){
                return res.status(401).send({status:'error', message:'solicitud no autorizada'})    
            }else{
                req.usuario = decode.user
                next()
            }
        })
    }
}

module.exports = {
    verifyToken,
    verifyRole,
    verifyTokenImg
}