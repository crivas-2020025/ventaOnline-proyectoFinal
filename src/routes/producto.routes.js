//IMPORTACIONES
const express = require('express');
const productoController = require('../controllers/producto.controller');
const md_autentificacion = require('../middlewares/autentificacion');

//RUTAS
var api = express.Router();

api.post('/registrarProducto', md_autentificacion.Auth, productoController.RegistrarProducto);
api.get('/buscarProducto/:idProducto', md_autentificacion.Auth, productoController.ObtenerProductosId);
api.get('/buscarNombreProducto/:nombreProducto', md_autentificacion.Auth, productoController.ObtenerProductoNombre);
api.get('/productos', md_autentificacion.Auth, productoController.ObtenerProductos);

api.put('/editarProducto/:idProducto', md_autentificacion.Auth, productoController.EditarProductos);
api.delete('/eliminarProducto/:idProducto', md_autentificacion.Auth, productoController.EliminarProductos);
api.put('/stockProducto/:idProducto', md_autentificacion.Auth, productoController.stockProducto);

module.exports = api;