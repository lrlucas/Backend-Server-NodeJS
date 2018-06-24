var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());


app.put('/:tipo/:id',(req,res,next)=>{

    var tipo = req.params.tipo;
    var id = req.params.id;
    // Tipo de coleccion
    var tipoValidos = ['hospitales','medicos','usuarios'];
    if (tipoValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es valida',
            errors: { message:'Tipo de coleccion no es valida' }
        })
    }

    if(!req.files){
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message:'Debe seleccionar una imagen' }
        })
    }

    // Obtener el nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extencionArchivo = nombreCortado[nombreCortado.length -1];

    // Solo estas extenciones aceptamos
    var extencionesValidas = ['png','jpg','gif','jpeg'];

    if(extencionesValidas.indexOf(extencionArchivo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors:{message:'Las extenciones validas son '+extencionesValidas.join(', ')}
        })
    }

    // Nombre de archivos personalizado
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extencionArchivo}`;

    // Mover el archivo de temporal a un path especifico en el servidor
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv( path, err=>{
        if (err){
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors:err
            })
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido',
        //     extencionArchivo:extencionArchivo
        // })

    });



});



function subirPorTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios'){

        Usuario.findById(id,(err,usuario)=>{

            if(!usuario){
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe, elimina el path anterior
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }
            usuario.img = nombreArchivo;
            usuario.save((err,usuarioActualizado) =>{

                usuarioActualizado.password = 'nel prro :v';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario:usuarioActualizado
                });
            })
        })

    }
    if (tipo === 'medicos'){

        Medico.findById(id,(err,medico)=>{

            if(!medico){
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Medico no existe',
                    errors: { message: 'Medico no existe' }
                });
            }

            var pathViejo = './uploads/medicos/' + medico.img;

            // Si existe, elimina el path anterior
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }
            medico.img = nombreArchivo;
            medico.save((err,medicoActualizado) =>{

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });
            })
        })

    }
    if (tipo === 'hospitales'){

        Hospital.findById(id,(err,hospital)=>{

            if(!hospital){
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe' }
                });
            }

            var pathViejo = './uploads/medicos/' + hospital.img;

            // Si existe, elimina el path anterior
            if(fs.existsSync(pathViejo)){
                fs.unlink(pathViejo);
            }
            hospital.img = nombreArchivo;
            hospital.save((err,hospitalActualizado) =>{

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });
            })
        })


    }


}

module.exports = app;