'use strict'

const { Long } = require('bson');
var mongoose = require('mongoose');
var Product = require('./products');
var Schema = mongoose.Schema;

var UsersSchema = Schema({
    first_name: String,
    last_name: String,
    dni: String,
    username: String,
    address: String,
    email: String,
    passwd: String,
    type_user: Number,
    cart:[{
        idP: String,
        nameP: String,
        priceP: Number,
        descriptionP: String,
        dateAdd: Date
    }]
});

module.exports = mongoose.model('Users', UsersSchema);