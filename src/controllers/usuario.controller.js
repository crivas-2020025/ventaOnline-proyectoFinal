//IMPORTACIONES
const Usuarios = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Productos = require('../models/producto.model');
const Categorias = require('../models/categoria.model');

//LOGIN
function login(req,res){
    var paramentros = req.body;

    Usuarios.findOne({email: paramentros.email},(err,usuarioGuardado)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'})
        if(usuarioGuardado){
            bcrypt.compare(paramentros.password,usuarioGuardado.password,(err,verificacionPassword)=>{
                if(verificacionPassword){
                    if(paramentros.obtenerToken === 'true'){
                        return res.status(200).send({
                            toke: jwt.crearToken(usuarioGuardado)
                        })
                    }else{
                        usuarioGuardado.password = undefined;
                        return res.status(200).send({usuario: usuarioGuardado})
                    }
                }else{
                    return res.status(500).send({mensaje:'La contrasena no coincide'})
                }
            })
        }else{
            return res.status(500).send({mensaje: 'El usuario no se encuentra o no se identifica'})
        }
    })
}

//AGREGAR ADMIN -- AL INSTANTE
function RegistrarAdmin(req, res){
    var usuariosModel = new Usuarios();   
    usuariosModel.nombre = 'ADMIN';
    usuariosModel.email = 'Admin@gmail.com';
    usuariosModel.rol = 'ROL_ADMINISTRADOR';

    Usuarios.find({ nombre: 'ADMIN', email: 'Admin@gmail.com'}, (err, usuarioEncontrato) => {
        if (usuarioEncontrato.length == 0) {
            bcrypt.hash("123456",null, null, (err, passswordEncypt) => { 
                usuariosModel.password = passswordEncypt
                usuariosModel.save((err, usuarioGuardado) => {
                console.log(err)
                })
            })
        } else {
            console.log('Este usuario con el puesto de Administrador ya esta creado')
        }
    })
}

//ADMIN AGREGAR USUARIO - CLIENTE/ADMIN
function RegistrarCliente(req, res){
    var paramentros = req.body;
    var usuariosModel = new Usuarios();
     
    if(paramentros.nombre, paramentros.email, paramentros.password){
        usuariosModel.nombre = paramentros.nombre;
        usuariosModel.email =  paramentros.email;
        usuariosModel.password = paramentros.password;
        usuariosModel.rol = paramentros.rol;
            
        if(req.user.rol == "ROL_ADMINISTRADOR"){
            Usuarios.find({nombre: paramentros.nombre, email: paramentros.email, password: paramentros.password, rol: paramentros.rol}, (err, clienteGuardado)=>{
                if(clienteGuardado.length == 0){
                    bcrypt.hash(paramentros.password, null,null, (err, passwordEncriptada)=>{
                        usuariosModel.password = passwordEncriptada;
                        usuariosModel.save((err, clienteGuardado) => {
                            if(err) return res.status(500).send({mensaje: 'No se realizo la accion'});
                            if(!clienteGuardado) return res.status(404).send({mensaje: 'No se agrego al usuario'});
            
                            return res.status(201).send({usuarios: clienteGuardado});
                         })
                    })
                }else{
                    return res.status(500).send({ mensaje: 'Error en la peticion' });
                }
            })
        }else{
            return res.status(500).send({ mensaje: 'Solo el administrador puede completar esta accion' });
        } 
    }    
}
    
//EDITAR ROL
function EditarUsuario(req, res) {
    var idUsuario = req.params.idUsuario;
    var paramentros = req.body;

    if (req.user.rol == 'ROL_ADMINISTRADOR') {
        Usuarios.findById(idUsuario, (err, usuarioRol) => {
            if (usuarioRol.rol == "ROL_CLIENTE") {
                Usuarios.findByIdAndUpdate({ _id: idUsuario }, paramentros, {new:true}, (err, usuarioEditado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!usuarioEditado) return res.status(400).send({ mensaje: 'No se pudo editar al usuario cliente' });
                    return res.status(200).send({usuarios: usuarioEditado });
                })
            } else{
                return res.status(500).send({ mensaje: 'No posee permisos para editar al usuario'});
            }  
        })
    }
}

//ELIMINAR CLIENTE 
function EliminarUsuario(req, res) {
    var idUsuario = req.params.idUsuario;
    var paramentros = req.body;

    if (req.user.rol == 'ROL_ADMINISTRADOR') {
        Usuarios.findById(idUsuario, (err, usuarioRol) => {
            if (usuarioRol.rol == "ROL_CLIENTE") {
                Usuarios.findByIdAndDelete({ _id: idUsuario }, paramentros, (err, usuarioEliminado) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!usuarioEliminado) return res.status(400).send({ mensaje: 'No se pudo eliminar al usuario cliente' });
                    return res.status(200).send({usuarios: usuarioEliminado });
                })
            } else{
                return res.status(500).send({ mensaje: 'No posee permisos para eliminar al usuario'});
            }  
        })
    }
}

//PERFIL DEL CLIENTE
//CLIENTE AGREGAR UN NUEVO USUARIO
function AgregarClientePerfil(req, res){
    var paramentros = req.body;
    var usuariosModel = new Usuarios();
     
    if(paramentros.nombre, paramentros.email, paramentros.password){
        usuariosModel.nombre = paramentros.nombre;
        usuariosModel.email =  paramentros.email;
        usuariosModel.password = paramentros.password;
        usuariosModel.rol = 'ROL_CLIENTE';
            
        if(req.user.rol == "ROL_CLIENTE"){
            Usuarios.find({nombre: paramentros.nombre, email: paramentros.email, password: paramentros.password}, (err, clienteGuardado)=>{
                if(clienteGuardado.length == 0){
                    bcrypt.hash(paramentros.password, null,null, (err, passwordEncriptada)=>{
                        usuariosModel.password = passwordEncriptada;
                        usuariosModel.save((err, clienteGuardado) => {
                            if(err) return res.status(500).send({mensaje: 'No se realizo la accion'});
                            if(!clienteGuardado) return res.status(404).send({mensaje: 'No se agrego al usuario'});
            
                            return res.status(201).send({usuarios: clienteGuardado});
                         })
                    })
                }else{
                    return res.status(500).send({ mensaje: 'Error en la peticion' });
                }
            })
        }else{
            return res.status(500).send({ mensaje: 'Solo el administrador puede completar esta accion' });
        } 
    }    
}


//EDITAR PERFIL DEL CLIENTE
function EditarClientePerfil(req, res){
    var idUsuario = req.params.idUsuario;
    var paramentros = req.body;

    if(idUsuario == req.user.sub){

    if(req.user.rol == "ROL_CLIENTE"){
        Usuarios.findByIdAndUpdate({_id: idUsuario}, paramentros,{new:true},(err, clientePerfilEditado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                if(!clientePerfilEditado) return res.status(400).send({mensaje: 'No se puedo editar el perfil del cliente'});
                
                return res.status(200).send({usuarios: clientePerfilEditado});
            })
    } else {
        return res.status(500).send({mensaje: 'No posee permisos para completar la peticion'});
    }
    }else{
        return res.status(500).send({mensaje: 'Solo debe editar su propio perfil'});
    }
}

//ELIMINAR PERFIL DEL CLIENTE
function EliminarClientePerfil(req, res){
    var idUsuario = req.params.idUsuario;

    if(idUsuario == req.user.sub){

    if(req.user.rol == "ROL_CLIENTE"){
        Usuarios.findByIdAndDelete({_id: idUsuario},(err, clientePerfilEliminado)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
                if(!clientePerfilEliminado) return res.status(400).send({mensaje: 'No se puedo eliminar el perfil del cliente'});
                
                return res.status(200).send({usuarios: clientePerfilEliminado});
            })
    } else {
        return res.status(500).send({mensaje: 'No posee permisos para completar la peticion'});
    }
    }else{
        return res.status(500).send({mensaje: 'Solo debe eliminar su propio perfil'});
    }
}

//CLIENTE AGREGAR PRODUCTO A CARRITO
function carritoCompra(req, res) {
    const parametros = req.body;

    Productos.findOne({nombre: parametros.producto}, (err,productoCarrito) => {
        if (err) return res.status(500).send({ mensaje:'Error en la peticion'});
        if (!productoCarrito) return res.status(404).send({mensaje: 'No se obtuvo ese producto, verifique'});

        Usuarios.find({_id:req.user.sub},(err,clienteLogeado)=>{
            if(err) return res.status(500).send({mensaje:'Error en la peticion de usuario'});
            if(!clienteLogeado) return res.status(404).send({mensaje:'No fue posible realizar la accion'});

            return res.status(200).send({usuarios:clienteLogeado})
        })

        Usuarios.find({_id: req.user.sub}, {carritoCompra:{$elementMatch:{producto: parametros.producto}}},(err, res)=>{
            if (res==null){
                Usuarios.findByIdAndUpdate(req.user.sub,{
                    $push:{
                        carritoCompra:{
                            producto: parametros.producto, productoStock: parametros.productoStock, 
                            precio: productoCarrito.precio,
                            subTotal: productoCarrito.precio * parametros.productoStock
                        }
                    }
                },{new:true},(err, usuarioCarrito)=>{
                        if (err) return res.status(500).send({mensaje:'Error en la peticion' });
                        if(!usuarioCarrito) return res.status(404).send({mensaje:'Error al agregar lo que desea'});

                        let carritoContenido = 0;
                        for (let i=0; i < usuarioCarrito.carritoCompra.length; i++) {
                            carritoContenido = carritoContenido + usuarioCarrito.carritoCompra[i].precio
                        }

                        Usuarios.findByIdAndUpdate(req.user.sub, {totalCarrito: carritoContenido},{new:true},(err,carritoTotal) => {
                            if (err) return res.status(500).send({mensaje:'Error en la peticion dentro del carrito'});
                            if (!carritoTotal) return res.status(404).send({mensaje:'Error al modificar'});
                        })
                    })
            }else{
                Usuarios.findByIdAndUpdate({$inc:{productoStock: parametros.productoStock}},{new:true},(err,productoModificado) => {
                    if(err) return res.status(500).send({mensaje: 'Error en el carrito'});
                    if(!productoModificado) return res.status(500).send({mensaje: 'Error al realizar la modificacion'});

                    return res.status(200).send({productos: productoModificado});
                })
            }
        })
    })
}

function productoCarrito(req,res){
    var parametros = req.body;

    Usuarios.findByIdAndUpdate(req.user.sub,{$pull:{carritoCompra:{producto:parametros.producto}}},{new:true},(err, eliminacion)=>{
            if (err) return res.status(500).send({mensaje: 'Error en la peticion' });
            if (!eliminacion) return res.status(404).send({mensaje: 'Error en la accion en usuarios'});

            let carritoContenido = 0;
            for (let i = 0; i < eliminacion.carritoCompra.length; i++) {
                carritoContenido = carritoContenido + eliminacion.carritoCompra[i].subTotal;
            }

    Usuarios.findByIdAndUpdate(req.user.sub,{totalCarrito: carritoContenido},{new:true},(err, actualizacionTotalCarrito)=>{
        if (err) return res.status(500).send({mensaje: 'Error en la peticion del carrito' });
        if (!actualizacionTotalCarrito) return res.status(500).send({mensaje: 'No fue posible modificar el carrito' });

        return res.status(200).send({mensaje: actualizacionTotalCarrito});
        }
      );
    }
  );
}

//BUSQUEDAS
//VER CATEGORIAS POR NOMBRE
function ObtenerCategoriaNombre(req, res){
    var nombreCategoria = req.params.nombreCategoria;

    if(req.user.rol == "ROL_CLIENTE"){
        Categorias.find({nombre: {$regex:nombreCategoria,$options:'i'}}, (err, categoriaEncontrado) =>{
            if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
            if(!categoriaEncontrado) return res.status(404).send({mensaje : "Error, no se encuentran categorias con ese nombre"});

            return res.status(200).send({categorias : categoriaEncontrado});
        })
    } else {
        return res.status(500).send({mensaje: 'No posee permisos para completar la peticion'});
    }
}

//BUSCAR PRODUCTOS POR CATEGORIA
function ObtenerProductoCategoria(req, res){
    var nombreCategoria = req.params.nombreCategoria;

    if(req.user.rol == "ROL_CLIENTE"){
        Categorias.findOne({nombre: {$regex:nombreCategoria,$options:'i'}},(err, categoriaEncontrado)=>{
            if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
            if(!categoriaEncontrado) return res.status(404).send({mensaje : "Error, no se encuentran categorias con ese nombre"});

            Productos.find({idCategoria: categoriaEncontrado._id}, (err, catalogoProductos)=>{
                if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
                if(!catalogoProductos) return res.status(404).send({mensaje : "Error, no se encuentran productos en dicha categoria"});

                return res.status(200).send({productos : catalogoProductos});
            }).populate('idCategoria', 'nombreCategoria')
        })
    } else {
        return res.status(500).send({mensaje: 'No posee permisos para completar la peticion'});
    }
}

module.exports = {
    login,
    RegistrarAdmin,
    RegistrarCliente,
    EditarUsuario,
    EliminarUsuario,
    EditarClientePerfil,
    EliminarClientePerfil,
    carritoCompra,
    AgregarClientePerfil,
    ObtenerCategoriaNombre,
    ObtenerProductoCategoria,
    productoCarrito
}