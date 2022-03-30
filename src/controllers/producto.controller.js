//IMPORTACIONES
const Productos = require('../models/producto.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')

// ADMIN ADJUNTA PRODUCTO
function RegistrarProducto(req, res){
    var paramentros = req.body;
    var productoModels = new Productos();
 
    if(paramentros.nombre, paramentros.stock, paramentros.precio){
        productoModels.nombre = paramentros.nombre;
        productoModels.stock = paramentros.stock;
        productoModels.precio =  paramentros.precio;
        productoModels.idCategoria = paramentros.idCategoria;
    }else{
        return res.status(500).send({ mensaje: "Error en la accion" });
     } if(req.user.rol == "ROL_ADMINISTRADOR"){
         Productos.find({nombre: paramentros.nombre,idCategoria: paramentros.idCategoria}, 
            (err, productoGuardado)=>{
                //if(productoGuardado == paramentros.idCategoria){
                if(productoGuardado.length == 0){
                    productoModels.save((err, accionGuardada)=>{
                        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                        if(!accionGuardada) return res.status(404).send({mensaje: 'El producto no se agrego'});
                        return res.status(201).send({productos: accionGuardada});
                     })
                }
            })
        } else {
            return res.status(500).send({mensaje: 'Solamente el Administrador puede completar esta accion'});
        }
    }

//BUSQUEDAS
//OBTNER POR ID
function ObtenerProductosId(req, res){
    var idProducto = req.params.idProducto;

    if(req.user.rol == "ROL_ADMINISTRADOR"){
        Productos.findById(idProducto, (err, productoEncontrado) =>{
            return res.send({productos : productoEncontrado});
        })
    } else {
        return res.status(500).send({mensaje: 'No tiene todos los permisos para completar la peticion'});
    }
}

//OBTNER POR NOMBRE
function ObtenerProductoNombre(req, res){
    var nombreProducto = req.params.nombreProducto;

    //if(req.user.rol == "ROL_ADMINISTRADOR"){
        Productos.find({nombre: {$regex:nombreProducto,$options:'i'}}, (err, productoEncontrado) =>{
            if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
             if(!productoEncontrado) return res.status(404).send({mensaje : "Error, no se encuentran productos con ese nombre"});
             return res.status(200).send({productos : productoEncontrado});
         })
    /*} else {
        return res.status(500).send({mensaje: 'No posee permisos para completar la peticion'});
    }*/
}

//OBTENER TODOS LOS PRODUCTOS 
function ObtenerProductos(req, res){

    if(req.user.rol == "ROL_ADMINISTRADOR"){
    Productos.find((err,productoEncontrado) =>{
        if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
         if(!productoEncontrado) return res.status(404).send({mensaje : "Error, no se encuentran productos"});

         return res.status(200).send({productos : productoEncontrado});
     })
    } else {
        return res.status(500).send({mensaje: 'No posee permisos para completar la peticion'});
    }
    };

// EDITAR PRODUCTOS
function EditarProductos(req, res){
    var idProducto = req.params.idProducto;
    var paramentros = req.body;

    if(req.user.rol == "ROL_ADMINISTRADOR"){
        Productos.findOneAndUpdate({_id: idProducto}, paramentros,{new:true},
            (err, productoEditado)=>{
                if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                if(!productoEditado) return res.status(400).send({mensaje: 'No se puedo editar al producto'});
                
                return res.status(200).send({productos: productoEditado});
            })
    } else {
        return res.status(500).send({mensaje: 'No posee permisos para completar la peticion'});
    }
}

// ELIMINAR PRODUCTOS --  SI SE RETIRA EL PRODUCTO
function EliminarProductos(req, res){
    var idProducto = req.params.idProducto;

    if(req.user.rol == "ROL_ADMINISTRADOR"){
        Productos.findOneAndRemove({_id: idProducto},(err, productoEliminado)=>{
                if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                if(!productoEliminado) return res.status(400).send({mensaje: 'No se puedo eliminar al producto'});
                
                return res.status(200).send({productos: productoEliminado});
            })
    } else {
        return res.status(500).send({mensaje: 'No posee permisos para completar la peticion'});
    }
}

//INCREMENTAR/ RESTAR LA CANTDAD DEL PRODUCTO
function stockProducto(req, res) {
    const productoId = req.params.idProducto;
    const parametros = req.body;

    if(req.user.rol == "ROL_ADMINISTRADOR"){
    Productos.findByIdAndUpdate(productoId, { $inc : { stock: parametros.stock } }, { new: true },
        (err, productoModificado) => {
            if(err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!productoModificado) return res.status(500).send({ mensaje: 'Error al editar el stock del Producto'});

            return res.status(200).send({ productos: productoModificado});
        })
    } else {
        return res.status(500).send({mensaje: 'No posee permisos para completar la peticion'});
    }
    
}


module.exports = {
    RegistrarProducto,
    ObtenerProductosId,
    ObtenerProductoNombre,
    ObtenerProductos,
    EditarProductos,
    EliminarProductos,
    stockProducto
}