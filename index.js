const mongoose = require('mongoose');
const app = require('./app');
var Categorias = require('./src/models/categoria.model')
UsuarioController = require('./src/controllers/usuario.controller');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ventaOnline', {useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Se encuentra conectado a la base de datos");

    app.listen(3000, function(){
        console.log("Esta corriendo en el puerto 3000")
    })

    UsuarioController.RegistrarAdmin();

    Categorias.find({ nombre:'Categoria Default' }, (err, categoriaRegistrada) => {
        if (categoriaRegistrada.length == 0) {
            var productoModel = new Categorias()

            productoModel.nombre = 'Categoria Default'
            productoModel.save({ nombre: "Categoria Default"}, (err, categoriaRegistrada)=>{
        })
        } else {
            console.log("Existe un categoria por defecto")
        }
    })

}).catch(err => console.log(err))