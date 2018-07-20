module.exports.SEED = 'este-es-un-seed-dificil';


// Google

module.exports.CLIENT_ID = '300725710956-2m7rk1dv5hkhhghkscbiu0er1gckaoj9.apps.googleusercontent.com';
module.exports.GOOGLE_SECRET = 'j4G-nQv1CCazXzM-jN6TFA5o';



// ============================
//  Puerto
// ============================
process.env.PORT = process.env.PORT || 3000;



// ============================
//  Entorno
// ============================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev'




// ============================
//  Base de datos
// ============================


let urlDB;
 
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/hospitalDB';
} else {
    urlDB = 'mongodb://lrlucas:lucas78199719@ds243501.mlab.com:43501/hospitaldbbackend';
} 


/* MONGO_URI = 'mongodb://lrlucas:lucas78199719@ds243501.mlab.com:43501/hospitaldbbackend'; */
/* urlDB = process.env.MONGO_URI; */



process.env.URL_DB = urlDB;
