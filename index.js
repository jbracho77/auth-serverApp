const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./db/config');
require('dotenv').config();

// Mostran el consola las variables de entorno
//console.log( process.env );

//Crear el servidor/aplicación de express
const app = express();

// GET ejemplo 
// app.get('/', ( req, res ) => {
//     //console.log('Petición en /');
//     res.status(200).json( { 
//         ok: true,
//         msg: 'Todo salió bien',
//         uid: 1234
//     });
// });

// Base de datos 
dbConnection();

// Directorio público
app.use( express.static('public') );

// cors
app.use( cors() );

// Lectura y parseo del body 
app.use( express.json() ); 

// Rutas
app.use( '/api/auth', require('./routes/auth') );


app.listen( process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`);
} );process.env.PORT


