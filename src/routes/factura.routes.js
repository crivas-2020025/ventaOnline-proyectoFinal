//IMPORTACIONES
const express = require('express');
const facturaController = require('../controllers/factura.controller');
const md_autentificacion = require('../middlewares/autentificacion');

//RUTAS
var api = express.Router();

api.post('/facturacion', md_autentificacion.Auth,facturaController.facturacion);
api.get('/obtenerfacturacion', md_autentificacion.Auth,facturaController.ObtenerFacturas);
api.get('/obtenerProductosfacturacion/:idFactura', md_autentificacion.Auth,facturaController.ObtenerProductosFactura);

module.exports = api;