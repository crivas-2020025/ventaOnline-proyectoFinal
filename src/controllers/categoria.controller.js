//IMPORTACIONES
const Categorias = require('../models/categoria.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')
const Productos =  require('../models/producto.model')

// ADMIN ADJUNTA PRODUCTO
function RegistrarCategoria(req, res){
    var paramentros = req.body;
    var categoriaModels = new Categorias();
 
    if(paramentros.nombre){
        categoriaModels.nombre = paramentros.nombre
    }else{
        return res.status(500).send({ mensaje: "Error en la accion" });
     } if(req.user.rol == "ROL_ADMINISTRADOR"){
         Categorias.find({nombre: paramentros.nombre}, 
            (err, categoriaGuardada)=>{
                if(categoriaGuardada.length == 0){
                    categoriaModels.save((err, accionGuardada)=>{
                        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                        if(!accionGuardada) return res.status(404).send({mensaje: 'La categoria no se agrego'});
                        return res.status(201).send({productos: accionGuardada});
                     })                    
                }
            })
        } else {
            return res.status(500).send({mensaje: 'Solamente el Administrador puede completar esta accion'});
        }
    }

//OBTENER TODAS LAS CATEGORIAS 
function ObtenerCategorias(req, res){

    if(req.user.rol == "ROL_ADMINISTRADOR"){
    Categorias.find((err,categoriaEncontrado) =>{
        if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
         if(!categoriaEncontrado) return res.status(404).send({mensaje : "Error, no se encuentran categorias"});

         return res.status(200).send({categorias : categoriaEncontrado});
     })
    } else {
        return res.status(500).send({mensaje: 'No posee permisos para completar la peticion'});
    }
    };

//EDITAR CATEGORIAS
function EditarCategorias(req, res){
    var paramentros = req.body;
    var idCategoria = req.params.idCategoria;

    if(req.user.rol == "ROL_ADMINISTRADOR"){
    Categorias.findByIdAndUpdate({_id: idCategoria, nombre:paramentros.nombre}, paramentros, {new:true}, (err, categoriaEditada)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!categoriaEditada) return res.status(400).send({mensaje: 'No se pudo editar dicha categoria'});

        return res.status(200).send({categorias: categoriaEditada});
    })
    } else {
        return res.status(500).send({mensaje: 'No posee permisos para completar la peticion'});
    }
};

//ELIMINAR CATEGORIA
function EliminarCategoria(req, res){
    var idCategoria = req.params.idCategoria;

    if(req.user.rol == "ROL_ADMINISTRADOR"){
    Categorias.findByIdAndDelete({_id: idCategoria}, (err, categoriaEliminada)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!categoriaEliminada) return res.status(400).send({mensaje: 'No se pudo eliminar dicha categoria'});

        return res.status(200).send({categorias: categoriaEliminada});
    })
    } else {
        return res.status(500).send({mensaje: 'No posee permisos para completar la peticion'});
    }
};

//ELIMAR CATEGORIA A CATEGORIA DEFAULT
function eliminarDefault(req,res){
    var idCategoria = req.params.idCategoria;

    Categorias.findOne({nombre: 'Categoria Default'}, (err, categoriaDefault) => {
        Productos.updateMany({idCategoria: idCategoria }, { idCategoria: categoriaDefault._id }, (err, categoriaEliminar) => {
            Categorias.findByIdAndDelete(idCategoria, (err, idCategoriaDefualt) => {
                if (err)return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!idCategoriaDefualt)return res.status(500).send({ mensaje: 'No se pudo realizar la accion en categoria' });

                return res.status(200).send({categorias: idCategoria });
            })
        })
    })
}

module.exports = {
    RegistrarCategoria,
    ObtenerCategorias,
    EditarCategorias,
    EliminarCategoria,
    eliminarDefault
}