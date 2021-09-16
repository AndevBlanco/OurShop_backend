'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var credentials = require('./credentials');

mongoose.Promise = global.Promise

mongoose.connect(
    'mongodb+srv://AndevBlanco:' + credentials.PASSWD + '@ourshop.sawvp.mongodb.net/Viena?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}
    )
    .then(() => {
        console.log("Conexión establecida con éxito");

        //Creating the server
        app.listen(process.env.PORT || 3700, () => {
            console.log("Servidor corriendo correctamente");
        });
    })
    .catch(error => console.log(error));