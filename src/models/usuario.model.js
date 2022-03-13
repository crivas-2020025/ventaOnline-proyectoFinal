const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usuarioSchema = Schema ({
    nombre: String,
    email: String,
    password: String,
    rol: String,
    carritoCompra:[{
        producto: String,
        productoStock: Number,
        precio: Number,
        subTotal: Number
    }],
    totalCarrito: Number,
});

module.exports = mongoose.model('usuarios', usuarioSchema);