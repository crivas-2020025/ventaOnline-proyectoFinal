const Productos = require('../models/producto.model');
const Usuarios = require('../models/usuario.model');
const Facturas = require('../models/factura-model');

//FACTURACION
function facturacion(req, res) {
    const facturasModel = new Facturas();
    
    if(req.user.rol == "ROL_CLIENTE"){
    Usuarios.findById(req.user.sub, (err, usuarios)=>{
        facturasModel.productosCompra = usuarios.carritoCompra;
        facturasModel.idUsuario = req.user.sub;
        facturasModel.totalCompra = usuarios.totalCarrito;
        facturasModel.nit = req.body.nit;
  
        facturasModel.save((err, facturacion)=>{
        Usuarios.findByIdAndUpdate(req.user.sub,{$set:{carritoCompra:[]}, totalCarrito: 0},{new:true},(err, carritoCompra) => {
            return res.status(500).send({facturas: facturacion});
          }
        );
      });
    });
    } else {
        return res.status(500).send({mensaje: 'No posee permisos para completar la peticion'});
    }
}

//BUSQUEDAS
//BUSCAR FACTURAS QUE POSEEN LOS USUARIOS
function ObtenerFacturas(req, res){

    if(req.user.rol == "ROL_ADMINISTRADOR"){
    Facturas.find((err,facturaEncontrada) =>{
        if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
         if(!facturaEncontrada) return res.status(404).send({mensaje : "Error, no se encuentran facturas"});

         return res.status(200).send({facturas : facturaEncontrada});
     })
    } else {
        return res.status(500).send({mensaje: 'No posee permisos para completar la peticion'});
    }
};

//BUSCAR PRODUCTOS DE UNA FACTURA
function ObtenerProductosFactura(req, res){
    var idFactura = req.params.idFactura;

    if(req.user.rol == "ROL_ADMINISTRADOR"){
        Facturas.findById(idFactura, (err, productoEncontrado) =>{
            return res.send({productos : productoEncontrado});
        })
    } else {
        return res.status(500).send({mensaje: 'No posee permisos para completar la peticion'});
    }
}


module.exports = {
    facturacion,
    ObtenerFacturas,
    ObtenerProductosFactura
}