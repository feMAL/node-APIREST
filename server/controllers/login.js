//Libreries
const {OAuth2Client} = require('google-auth-library');
const bcryprt = require('bcrypt')
//Services
const jwtService = require('../services/token-generator')
//Models
const User = require('../models/users')

//Instances
const client = new OAuth2Client(process.env.CLIENT_ID);


//Methods
const singin = (req, res) => {
    let params = req.body

    let email = params.email
    
    if(!email || !params.password){
        res.status(400).send({status:'error', message: 'request mal formada'});
    }
    User.findOne({email})
        .exec((err,user)=>{
            if(err){
                return res.status(500).send({status:'error', message: err.message});
            }
            if(!user){
                return res.status(404).send({status:'error', message: 'Usuario o contraseña incorrectos'});
            }else{
                if(!bcryprt.compareSync(params.password,user.password)){
                    return res.status(404).send({status:'error', message: 'Usuario o contraseña incorrectos'});
                }
                let token = jwtService.tokengenerator({user})
                res.status(200).send({ status: 'ok', user, token })
            }
        })
}


//GOOGLE CONFIGURATION GoogleSingIn

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return { 
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
  

const googleSingIn = async (req,res) =>{
    let token = req.body.idtoken

    let googleUser = await verify(token)
        .catch(e => { 
            return res.status(403)
                .send({
                    status: 'error',
                    err : e
                })
        })
    //Buscar el usuario autenticado de google en la base de datos de usuarios.
    User.findOne({email: googleUser.email}, (err,userGoogle)=>{
        if(err){
            return res.status(500).send({status:'error', message: err.message});
        }
        //Si el usuario se encuentra registrado enviarle el token de sesion solicitado
        if(userGoogle){
            if(!userGoogle.google){
                return res.status(404).send({status:'error', message: 'Este usuario se ha registrado por otro metodo de autenticación.'});
            }else{
                let app_token = jwtService.tokengenerator({user : userGoogle})
                res.status(200).send({ status: 'ok', user: userGoogle, token: app_token })
            }            
        //Si el usuario no se encuentra en la DB => Creamos el usuario en la DB
        }else{
            let user = new User()

            user.name = googleUser.name
            user.email = googleUser.email
            user.img = googleUser.img
            user.google = true
            user.password = ':)'

            user.save((err,saveUser)=>{
                if(err){
                    return res.status(500).send({status:'error', message: err.message});
                }
                let app_token = jwtService.tokengenerator({user : userGoogle})
                res.status(200).send({ status: 'ok', user: saveUser, token: app_token })
            })
            
        }
    })

    //res.status(200).send({googleUser})
}

module.exports = {
    singin,
    googleSingIn
}