const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema;

let role_options = {
    values: ['ROLE_ADMIN','ROLE_USER','ROLE_MODERATOR'],
    message: '{VALUES} no es un rol valido'
};

let userSchema = new Schema({
    name : {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El email es necesario']
    },
    password: {
        type: String,
        required: [true, 'El password es necesario']
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        default: 'ROLE_USER',
        enum: role_options,
        required: [true, 'El rol es necesario']
    },
    status: {
        type: Boolean,
        default: true,
        required: [true, 'El estado es necesario']
    },
    google:{
        type: Boolean,
        default: false
    }
})

userSchema.methods.toJSON = function () {
    let user = this;
    let userObj = user.toObject();

    //delete userObj.password;

    return userObj;
}

userSchema.plugin(uniqueValidator,{ message: '{PATH} debe ser unico' });

module.exports = mongoose.model('user',userSchema);