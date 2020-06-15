require('./conf/conf')

const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser')
const path = require('path')

const app = express();


// Instanciando Routers
const userRoute = require('./routes/users')
const loginRoute = require('./routes/login')
const categoryRoute = require('./routes/category')
const productRoute = require('./routes/product')

console.log(' [+] Server waking up.')

//parese application/x-www-form-urlencoded (desactivado)
app.use(bodyParser.urlencoded({extended:false}));
//parse json activado
app.use(bodyParser.json());

console.log(path.resolve(__dirname, '../public'))

app.use(express.static(path.resolve(__dirname, '../public')))

/*Agreando Routers*/
app.use([userRoute,loginRoute,categoryRoute,productRoute])



//Connectando a mongoose
mongoose.connect('mongodb://localhost:27017/api_rest_model_2',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true
},(err,res)=>{
    if (err) throw err
    console.log(' [+] DB Server runing')

})
app.listen(process.env.PORT,()=>{
    console.log(` [+] Server running on port ${process.env.PORT}`)
})