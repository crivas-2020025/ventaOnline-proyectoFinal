const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var facturaSchema = Schema ({
    totalCompra: Number,
    nit: String,
    productosCompra:[{
        producto: String,
        productoStock: Number,
        precio: Number,
        subTotal: Number
    }],
    idUsuario: {type: Schema.Types.ObjectId, ref: 'usuarios'}
});

module.exports = mongoose.model('facturas', facturaSchema);