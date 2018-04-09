var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;
var app = express();

var Usuario = require('../models/usuario');

var GoogleAuth = require('google-auth-library')
var auth = new GoogleAuth;

const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = require('../config/config').GOOGLE_SECRET;



//======================================
// Autenticacion con Google
//======================================



app.post('/google',(req,res)=>{

    var token = req.body.token || 'xxx';

    var client = new auth.OAuth2(GOOGLE_CLIENT_ID,GOOGLE_SECRET,'');

    client.verifyIdToken(
        token,
        GOOGLE_CLIENT_ID,
        function (e, login) {

            if (e){
                return res.status(400).json({
                    ok: true,
                    mensaje: 'token no valido',
                    error:e
                })
            }

            var payload = login.getPayload();
            var userid = payload['sub'];

            Usuario.findOne({ email:payload.email },(err,usuario)=>{

                if (err){
                    return res.status(500).json({
                        ok: true,
                        mensaje: 'Error al buscar usuario - login',
                        error:err
                    });
                }

                if(usuario){

                    if(usuario.google === false){
                        return res.status(400).json({
                            ok: true,
                            mensaje: 'Debe de usar su autenticacion normal'
                        });
                    }else {

                        usuario.password = ':v';
                        var token = jwt.sign({usuario:usuario},SEED,{expiresIn:1400}); // 4 horas

                        res.status(200).json({
                            ok: true,
                            usuario: usuario,
                            token:token,
                            id: usuario._id
                        })

                    }
                // si el usuario no existe por correo
                }else {
                    var usuario = new Usuario();
                    usuario.nombre = payload.name;
                    usuario.email = payload.email;
                    usuario.password = ':D';
                    usuario.img = payload.picture;
                    usuario.google = true;

                    usuario.save((err,usuarioDB)=>{

                        if (err){
                            return res.status(500).json({
                                ok: true,
                                mensaje: 'Error al ccrear usuario - google',
                                error:err
                            });
                        }

                        var token = jwt.sign({usuario:usuarioDB},SEED,{expiresIn:1400}); // 4 horas

                        res.status(200).json({
                            ok: true,
                            usuario: usuarioDB,
                            token:token,
                            id: usuarioDB._id
                        });

                    });
                }
            });
        }

    )

});



//======================================
// Autenticacion Normal
//======================================
app.post('/',(req,res)=>{

    var body = req.body;

    Usuario.findOne({email:body.email},(err,usuarioDB)=>{

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            })
        }
        // Borrar el '- email' cuando se suba a produccion
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            })
        }

        // Borrar el '- password' cuando se suba a produccion
        if (!bcrypt.compareSync(body.password,usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            })
        }

        // Crear token valido
        usuarioDB.password = ':v';
        var token = jwt.sign({usuario:usuarioDB},SEED,{expiresIn:1400}); // 4 horas



        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token:token,
            id: usuarioDB._id
        })
    });


});


















module.exports = app;