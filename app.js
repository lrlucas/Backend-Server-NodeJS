// Requires
require('./config/config');
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// Inicializar variables
var app = express();

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
  });


// Body parser //
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Server index config
// var serveIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serveIndex(__dirname + '/uploads'));



// Importar rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

// Coneccion a la base de datos
/* mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB',(err,res)=>{
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m',' online');
}); */

// coneccion con mongoDB
mongoose.connect( process.env.URL_DB, { useNewUrlParser: true }, (err, res) => {
    if (err) {
        /* throw err */
        console.log(`Error ${err}`)
    } else {
        console.log(`Base de datos Online`)
    }
});


// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/medico', medicoRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/upload', uploadRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/img', imagenesRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);



// Escuchar peticiones

app.listen( process.env.PORT, () => {
    console.log(`Servidor Express corriendo en el puerto ${ process.env.PORT }: online`);
});