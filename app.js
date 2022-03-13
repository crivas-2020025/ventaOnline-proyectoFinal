// IMPORTACIONES
const express = require('express');
const cors = require('cors');
var app = express();

// IMPORTACIONES RUTAS
const UsuarioRutas = require('./src/routes/usuario.routes');
const ProductoRutas = require('./src/routes/producto.routes');
const CategoriaRutas = require('./src/routes/categoria.routes');
const FacturasRutas = require('./src/routes/factura.routes')

//MIDDLEWARES -> INTERMEDIARIOS
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// CABECERAS
app.use(cors());

// CARGA DE RUTAS localhost:3000/api/
app.use('/api', UsuarioRutas, ProductoRutas, CategoriaRutas, FacturasRutas);

module.exports = app;