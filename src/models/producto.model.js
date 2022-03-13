const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productoSchema = Schema ({
    nombre: String,
    stock: Number,
    precio: Number,
    idCategoria: {type: Schema.Types.ObjectId, ref: 'categorias'}
});

module.exports = mongoose.model('productos', productoSchema);