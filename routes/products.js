'use strict'

var express = require('express');
var ProductsControllers = require('../controllers/products');
var router = express.Router();
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart();

router.get('/getAll', ProductsControllers.getAll);
router.get('', ProductsControllers.getProductItem);
router.get('/opinions', ProductsControllers.getAllOpinions);
router.post('', multipartMiddleware, ProductsControllers.saveProducts);
router.put('', multipartMiddleware, ProductsControllers.modifyProducts);
router.put('/opinions', ProductsControllers.modifyOpinions);
router.delete('', ProductsControllers.deleteProducts);

module.exports = router;