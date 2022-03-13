//IMPORTACIONES
const express = require('express');
const usuarioController = require('../controllers/usuario.controller');
const md_autentificacion = require('../middlewares/autentificacion');

//RUTAS
var api = express.Router();

//api.post('/registrarEmpresa', md_autentificacion.Auth, usuarioController.RegistrarEmpresa);

//LOGIN
api.post('/login', usuarioController.login);
api.post('/registrarCliente', md_autentificacion.Auth,usuarioController.RegistrarCliente);
api.put('/editarUsuario/:idUsuario', md_autentificacion.Auth,usuarioController.EditarUsuario);
api.delete('/eliminarUsuario/:idUsuario', md_autentificacion.Auth,usuarioController.EliminarUsuario);

//PERFIL CLIENTE
api.post('/AgregarClientePerfil', md_autentificacion.Auth,usuarioController.AgregarClientePerfil);
api.put('/editarClientePerfil/:idUsuario', md_autentificacion.Auth,usuarioController.EditarClientePerfil);
api.delete('/eliminarClientePerfil/:idUsuario', md_autentificacion.Auth,usuarioController.EliminarClientePerfil);

api.get('/buscarNombreCategoria/:nombreCategoria', md_autentificacion.Auth, usuarioController.ObtenerCategoriaNombre);
api.get('/buscarProductoCategoria/:nombreCategoria', md_autentificacion.Auth, usuarioController.ObtenerProductoCategoria);
api.put('/cancelarProductoCarrito', md_autentificacion.Auth,usuarioController.productoCarrito);

//CARRITO
api.put('/carritoCliente', md_autentificacion.Auth,usuarioController.carritoCompra);


module.exports = api;