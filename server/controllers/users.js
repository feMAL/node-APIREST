const bcrypt = require('bcrypt')
const _ = require('underscore')

const User = require('../models/users')

const getUser = (req,res) => {
    console.log(' [+] GET /user Request recived.')
    let user = req.params.id
    let since = req.query.since || 0
    let to = req.query.to || 10
    let searchParameters = {status:true}

    since = Number(since)
    to = Number(to)

    if(user){
       searchParameters._id = user
    }
    console.log(searchParameters)
    User.find(searchParameters)
        .skip(since)
        .limit(to)
        .exec((err,userFound)=>{
            if(err){
                return res.status(500).send({ok:false,error: err})
            }else{
                User.count({status:false},(err,count)=>{
                    res.status(200).send({ ok:true, amount:count, user : userFound})
                }) 
            }
        })
}

const updateUser = (req,res) => {
    console.log(' [+] PUT /user Request recived.')
    let userId = req.params.id;
    /* Filtrando parametro que si se pueden actualizar con underscore*/
    let newParams = _.pick(req.body,['name','email','img','status','role'])

    /*  
        Eliminar parametros a actualizar
        
        delete newParams.password
        delete newParams.google
    */

    User.findByIdAndUpdate(userId, newParams , {new: true, runValidators:true}, (error,userUpdated)=>{
        if(error) {
            console.log(' [-] PUT /user Error produced.')
            return res.status(500).send({
                ok: false,
                error
            })
        }else{
            if (!userUpdated._id){
                return res.status(404).send({
                    ok: false,
                    error: 'ID del usuario a modificar no fue encontrado.'
                })
            }else{
                res.status(200).send({
                    ok:true,
                    user: userUpdated
                });
            }
        }
    })
}

const saveUser = (req,res) => {
    console.log(' [+] POST /user Request recived.')
    let params = req.body;
    let user = new User({
        name    : params.name,
        email   : params.email,
        password: bcrypt.hashSync(params.password, 10),
        img     : 'null',
    });
    user.save((error,user)=>{
        if(error) {
            console.log(' [-] POST /user Error produced.')
            return res.status(500).send({
                ok: false,
                error 
            })
        }else{
            if(!user._id)
            {
                return res.status(404).send({
                    ok: false,
                    error : 'El registro creado no ha sido encontrado.' 
                })
            }else {
                res.status(200).send({
                    ok:true,
                    user
                });
            }

        }
    })
}

//Eliminacion de registro logica
const deleteUser = (req,res) => {
    console.log(' [+] DELETE Request recived.')
    let id = req.params.id;

    User.findByIdAndUpdate(id,{status:false},{new:true},(err,userDeleted)=>{
        if(err){
            return res.status(500).send({
                ok: false,
                error : 'Se ha producido un error en la aplicación' 
            })
        }else{
            if(!userDeleted){
                return res.status(404).send({
                    ok: false,
                    error : 'El registro a borrar no ha sido encontrado.' 
                })
            }else{
                res.status(200).send({
                    ok:true,
                    userDeleted
                });
            }
        }
    })
}

// Eliminacion de registro Real
/*app.delete('/user/:id',(req,res)=>{
    console.log(' [+] DELETE Request recived.')
    let id = req.params.id;
    User.findByIdAndRemove(id,(err,userRemoved)=>{
        if(err){
            return res.status(500).send({
                ok: false,
                error : 'Se ha producido un error en la aplicación' 
            })
        }else{
            if(!userRemoved){
                return res.status(404).send({
                    ok: false,
                    error : 'El registro a borrar no ha sido encontrado.' 
                })
            }else{
                res.status(200).send({
                    ok:true,
                    userRemoved
                });
            }
        }
    })
})*/

module.exports = {
    getUser,
    updateUser,
    saveUser,
    deleteUser
}

