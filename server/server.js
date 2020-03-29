require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json ... 
app.use(bodyParser.json());

//Configuración de rutas
app.use(require('./routes/index'));
console.log('Conexión: ', process.env.URLDB);
//mongoclient constructor
// mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
//     (err, res) => {
//         if (err) throw err;

//         console.log('Base de datos ONLINE');
//     });
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
    .then(console.log('Base de datos ONLINE'))
    .catch(err => {
        console.log(err);
    });


//Callback
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});