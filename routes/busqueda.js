var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');


//==============================
// Busqueda por collecion
//==============================
app.get('/coleccion/:tabla/:busqueda',(req,res)=>{

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var regex = new RegExp(busqueda,'i');

    var promesa;

    switch (tabla){
        case 'usuario':
            promesa = buscarUsuario(busqueda,regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda,regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda,regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje:'Los tipo de busqueda solo son usuario, hospitales y medicos',
                error: {message:'Tipo de Tabla/Coleccion no validos'}
            })
    }

    promesa.then( data=>{
        res.status(200).json({
            ok: true,
            [tabla]:data
        })
    })


});



//==============================
// Busqueda general
//==============================
app.get('/todo/:busqueda',(req,res,next)=>{

    var busqueda = req.params.busqueda;
    var regex = new RegExp(busqueda,'i');

    Promise.all([
        buscarHospitales(busqueda,regex),
        buscarMedicos(busqueda,regex),
        buscarUsuario(busqueda,regex)
    ]).then(respuestas=>{
        res.status(200).json({
            ok: true,
            hospital:respuestas[0],
            medicos:respuestas[1],
            usuarios:respuestas[2]
        })
    });
});


function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Hospital.find({nombre:regex})
            .populate('usuario', 'nombre email img')
            .exec((err,hospitales)=>{
                if (err){
                    reject('Error al cargar hospitales',err);
                }else {
                    resolve(hospitales);
                }
            });
    });
}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Medico.find({nombre:regex})
            .populate('usuario', 'nombre email img')
            .populate('hospital')
            .exec((err,medicos)=>{

            if (err){
                reject('Error al cargar medicos',err);
            }else {
                resolve(medicos);
            }
        });
    });
}

function buscarUsuario(busqueda, regex) {

    return new Promise((resolve, reject) => {

        Usuario.find({},'nombre email role img')
            .or([{'nombre':regex},{'email':regex}])
            .exec((err,usuarios)=>{
                if (err){
                    reject('Error al cargar usuarios',err);
                }else {
                    resolve(usuarios);
                }
            })

    });
}

module.exports = app;