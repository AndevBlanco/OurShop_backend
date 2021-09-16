'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductsSchema = Schema({
    name: String,
    price: Number,
    type: String,
    country: String,
    stock: Number,
    date_manufacture: Date,
    description: String,
    image_name: String,
    image_url: String,
    opinions: [{
        id_user: String,
        name_user: String,
        description: String,
        stars: Number
    }]
});

module.exports = mongoose.model('Products', ProductsSchema);