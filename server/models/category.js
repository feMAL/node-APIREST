const mongoose = require('mongoose')

const Schema = mongoose.Schema;


let categorySchema = mongoose.Schema({
    name : {
        type: String,
        required: [ true , 'El nombre de la categoria es obligatorio' ]
    },
    description: {
        type: String
    },
    createdBy: {
        type: Schema.ObjectId, ref:'user',require:true
    }
})

module.exports = mongoose.model('category',categorySchema)