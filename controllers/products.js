'use strict'

const Products = require('../models/products');
const aws = require("aws-sdk");
const fs = require("fs");
const credentials = require("../credentials");


const s3 = new aws.S3({
    accessKeyId: credentials.S3_ACCESS_KEY,
    secretAccessKey: credentials.S3_ACCESS_SECRET
});

var controllers = {
    getProductItem: function (req, res) {
        var productId = req.query.id;
        Products.findById(productId, (err, product) => {
            if (err) return res.status(500).send({status: false, type: '500', error: err});
            if (!product) return res.status(404).send({status:false, type: '404'});
            return res.status(200).send(product)
        })
    },
    
    getAll: function(req, res){
        try {
            Products.find().exec((err, product) => {
                if(err) return res.status(500).send({status: false, type: '500', error: err});
                if (!product) return res.status(404).send({status:false, type: '404'});
                var product_list = []
                for(var i in product){
                    product_list.push(product[i]);
                }
                return res.status(200).send(product_list);
            });
        } catch (error) {
            return res.status(500).send({status:false, type: '500', error: err});
        }
    },

    getAllOpinions: function(req, res){
        var productId = req.query.id;
        Products.findById(productId, (err, product) => {
            if (err) return res.status(500).send({status: false, type: '500', error: err});
            if (!product) return res.status(404).send({status:false, type: '404'});
            return res.status(200).send(product.opinions)
        })
    },

    saveProducts: function(req, res){
        try {
            var product = Products();
            var params = req.body;
            product.name = params.name;
            product.price = params.price;
            product.type = params.type;
            product.country = params.country;
            product.stock = params.stock;
            product.date_manufacture = params.date_manufacture;
            product.description = params.description;
            product.date_added = params.date_added;
            var imageResponse = ""

            /* if(req.files.file){
                var dataFile = req.files.file;
                var nameFile = dataFile.name;

                // Read content from the file
                const fileContent = fs.readFileSync(dataFile.path);

                // Setting up S3 upload parameters
                const file = {
                    Bucket: credentials.BUCKET_NAME,
                    Key: nameFile, // File name you want to save as in S3
                    Body: fileContent
                };

                // Uploading files to the bucket
                s3.upload(file, function(err, data) {
                    if (err) {
                        throw err;
                    }
                    // console.log(`File uploaded successfully. ${data.Location}`);
                });
                imageResponse = dataFile.name;
                product.image_url = credentials.URL_FILE + imageResponse;
            }else{
                imageResponse = "No image...";
            }
            product.image_name = imageResponse; */

            product.save((err, productStored) => {
                if(err) return res.status(500).send({status: false, type: '500', error: err});
                if (!productStored) return res.status(404).send({status:false, type: '404'});
                return res.status(200).send({product: productStored});
            });
        } catch (error) {
            return res.status(500).send({status:false, type: '500', error: error});
        }
    },

    modifyProducts: function(req, res){
        try {
            var product = new Products();
            var productId = req.query.id;
            var params = req.body;
            var imageResponse = ""

            /* if(req.files.file){
                var dataFile = req.files.file;
                var nameFile = dataFile.name;

                // Read content from the file
                const fileContent = fs.readFileSync(dataFile.path);

                // Setting up S3 upload parameters
                const file = {
                    Bucket: credentials.BUCKET_NAME,
                    Key: nameFile, // File name you want to save as in S3
                    Body: fileContent
                };

                // Uploading files to the bucket
                s3.upload(file, function(err, data) {
                    if (err) {
                        throw err;
                    }
                    // console.log(`File uploaded successfully. ${data.Location}`);
                });
                imageResponse = dataFile.name;
                product.image_url = credentials.URL_FILE + imageResponse;
            }else{
                imageResponse = "No se cargó imagen...";
            }
            product.image_name = imageResponse; */

            Products.findByIdAndUpdate(productId, params, (err, productUpdated) => {
                if(err) return res.status(500).send({status: false, type: '500', error: err});
                if (!productUpdated) return res.status(404).send({status:false, type: '404'});
                return res.status(200).send({product: productUpdated});
            });
        } catch (error) {
            return res.status(500).send({status:false, type: '500', error: error});
        }
    },

    modifyOpinions: function(req, res){
        try {
            var productId = req.query.id;
            var params = req.body;

            Products.findByIdAndUpdate(productId, { $push: { opinions: params } }, (err, productUpdated) => {
                if(err) return res.status(500).send({status: false, type: '500', error: err});
                if (!productUpdated) return res.status(404).send({status:false, type: '404'});
                return res.status(200).send({product: productUpdated});
            });
        } catch (error) {
            return res.status(500).send({status:false, type: '500', error: error});
        }
    },

    deleteProducts: function(req, res){
        try {
            var productId = req.query.id;

            Products.findByIdAndDelete(productId, (err, productDeleted) => {
                if(err) return res.status(500).send({status: false, type: '500', error: err});
                if (!productDeleted) return res.status(404).send({status:false, type: '404', message: "Doesn't exist..."});
                return res.status(200).send(true);
            });
        } catch (error) {
            return res.status(500).send({status:false, type: '500', error: error});
        }
    }
};

module.exports = controllers;