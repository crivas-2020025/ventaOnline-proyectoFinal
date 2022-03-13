//IMPORTACIONES
const express = require('express');
const categoriaController = require('../controllers/categoria.controller');
const md_autentificacion = require('../middlewares/autentificacion');

//RUTAS
var api = express.Router();

api.post('/registrarCategoria', md_autentificacion.Auth, categoriaController.RegistrarCategoria);
api.get('/obtenerCategorias', md_autentificacion.Auth, categoriaController.ObtenerCategorias);
api.put('/editarCategoria/:idCategoria', md_autentificacion.Auth, categoriaController.EditarCategorias);
api.delete('/eliminarCategoria/:idCategoria', md_autentificacion.Auth, categoriaController.EliminarCategoria);

//DEFAULT
api.delete('/eliminarDefault/:idCategoria', md_autentificacion.Auth, categoriaController.eliminarDefault);

module.exports = api;