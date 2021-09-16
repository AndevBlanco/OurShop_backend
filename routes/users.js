'use strict'

var express = require('express');
var UsersControllers = require('../controllers/users');
var router = express.Router();

router.get('/getAll', UsersControllers.getAll);
router.get('', UsersControllers.getUser);
router.get('/cart', UsersControllers.getAllCart);
router.post('', UsersControllers.saveUser);
router.post('/login', UsersControllers.login);
router.put('', UsersControllers.modifyUser);
router.put('/modifyPassword', UsersControllers.modifyUserPassword);
router.put('/cart', UsersControllers.modifyCart);
router.delete('', UsersControllers.deleteUser);
router.delete('/cart', UsersControllers.deleteCart);

module.exports = router;