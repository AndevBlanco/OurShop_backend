'use strict'

const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const credentials = require('../credentials');

var controller = {
    getUser: function (req, res) {
        var userId = req.query.id;
        Users.findById(userId, (err, user) => {
            if (err) return res.status(500).send({status: false, type: '500', error: err});
            if (!user) return res.status(404).send({status:false, type: '404'});
            return res.status(200).send(user)
        })
    },

    getAll: function(req, res){
        try {
            Users.find().exec((err, users) => {
                if(err) return res.status(500).send({status: false, type: '500', error: err});
                if (!users) return res.status(404).send({status:false, type: '404'});
                return res.status(200).send({
                    users
                });
            });
        } catch (error) {
            return res.status(500).send({status:false, type: '500', error: err});
        }
    },

    getAllCart: function(req, res){
        var userId = req.query.id;
        try {
            Users.findById(userId, (err, user) => {
                if (err) return res.status(500).send({status: false, type: '500', error: err});
                if (!user) return res.status(404).send({status:false, type: '404'});
                return res.status(200).send(user.cart)
            })
        } catch (error) {
            return res.status(500).send({status:false, type: '500', error: err});
        }
    },

    saveUser: function(req, res){
        try {
            var user = Users();
            var params = req.body;
            user.first_name = params.first_name;
            user.last_name = params.last_name;
            user.dni = params.dni;
            user.username = params.username;
            user.address = params.address;
            user.email = params.email;
            user.type_user = params.type_user;

            async function hashPassword(password) {
                const salt = await bcrypt.genSalt(10)
                const hash = await bcrypt.hash(password, salt)
                user.passwd = hash;
                user.save((err, userStored) => {
                    if(err) return res.status(500).send({status: false, type: '500', error: err});
                    if (!userStored) return res.status(404).send({status:false, type: '404'});
                    return res.status(200).send(userStored);
                });
            }
            hashPassword(params.passwd);
        } catch (error) {
            return res.status(500).send({status:false, type: '500', error: error});
        }
    },

    login: function (req, res) {
        var params = req.body;
        var emailUser = params.xemail;
        var passUser = params.xpassword;
        try{
            Users.findOne({email: emailUser}, function(err, result){
                if(err) return res.status(500).send({status: false, type: '500', error: err});
                if(!result) return res.status(404).send({status:false, type: '404'});
    
                async function comparePassword(password) {
                    const resultPass = await bcrypt.compare(passUser, password);
                    var dataUser = {
                        login: false,
                        id: result.id,
                        name: result.first_name + " " + result.last_name,
                        email: result.email
                    };
                    if(resultPass){
                        const expiresIn = 24*60*60;
                        const accesToken = jwt.sign({ if:result.id}, credentials.SECRET_KEY, { expiresIn:expiresIn});
                        dataUser.login = resultPass;
                        dataUser.accesToken = accesToken;
                        dataUser.expiresIn = expiresIn;
                    }
                    return res.status(200).send(dataUser);
                }
                if(passUser){
                    comparePassword(result.passwd);
                }
            });
        } catch (error) {
            return res.status(500).send({status:false, type: '500', error: err});
        }     
    },

    modifyUser: function(req, res){
        try {
            var userId = req.query.id;
            var params = req.body;
            delete params.passwd;

            Users.findByIdAndUpdate(userId, params, (err, userUpdated) => {
                if(err) return res.status(500).send({status: false, type: '500', error: err});
                if (!userUpdated) return res.status(404).send({status:false, type: '404'});
                return res.status(200).send(userUpdated);
            });
        } catch (error) {
            return res.status(500).send({status:false, type: '500', error: error});
        }
    },

    modifyUserPassword: function(req, res){
        try {
            var userId = req.query.id;
            var params = req.body;

            async function hashPassword(password) {
                const salt = await bcrypt.genSalt(10)
                const hash = await bcrypt.hash(password, salt)
                params.passwd = hash;
                Users.findByIdAndUpdate(userId, {passwd: params.passwd}, (err, userUpdated) => {
                    if(err) return res.status(500).send({status: false, type: '500', error: err});
                    if (!userUpdated) return res.status(404).send({status:false, type: '404'});
                    return res.status(200).send(userUpdated);
                });    
            }
            hashPassword(params.passwd);
        } catch (error) {
            return res.status(500).send({status:false, type: '500', error: error});
        }
    },

    modifyCart: function(req, res){
        try {
            var userId = req.query.id;
            var params = req.body;

            Users.findByIdAndUpdate(userId, { $push: {cart: params} }, (err, userUpdated) => {
                if(err) return res.status(500).send({status: false, type: '500', error: err});
                if (!userUpdated) return res.status(404).send({status:false, type: '404'});
                return res.status(200).send(userUpdated);
            });
        } catch (error) {
            return res.status(500).send({status:false, type: '500', error: error});
        }
    },

    deleteUser: function(req, res){
        try {
            var userId = req.query.id;

            Users.findByIdAndDelete(userId, (err, userDeleted) => {
                if(err) return res.status(500).send({status: false, type: '500', error: err});
                if (!userDeleted) return res.status(404).send({status:false, type: '404', message: "Doesn't exist..."});
                return res.status(200).send(true);
            });
        } catch (error) {
            return res.status(500).send({status:false, type: '500', error: error});
        }
    },

    deleteCart: function(req, res){
        try {
            var userId = req.query.id;
            var productId = req.query.idP;

            Users.findById(userId, (err, user) => {
                user.cart.map((item, index) => {
                    if(item.idP == productId){
                        user.cart.splice(index, 1);
                    }
                })
                user.save();
                if (err) return res.status(500).send({status: false, type: '500', error: err});
                if (!user) return res.status(404).send({status:false, type: '404'});
                return res.status(200).send(user)
            })
        } catch (error) {
            return res.status(500).send({status:false, type: '500', error: error});
        }
    }
}

module.exports = controller;