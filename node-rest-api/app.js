const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require("mongoose");

const morgan = require('morgan');

const productRoutes = require('./api/routes/product');
const orderRoutes = require('./api/routes/orders');


mongoose.connect(
    "mongodb://node-rest-api:" +
      process.env.MONGO_ATLAS_PW +
      "@node-rest-api-shard-00-00-wovcj.mongodb.net:27017,node-rest-api-shard-00-01-wovcj.mongodb.net:27017,node-rest-api-shard-00-02-wovcj.mongodb.net:27017/test?ssl=true&replicaSet=node-rest-api-shard-0&authSource=admin",
    {
      useMongoClient: true
    }
  );


  
  app.use(morgan("dev"));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });
  
  // Routes which should handle requests
  app.use("/products", productRoutes);
  app.use("/orders", orderRoutes);
  
  app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });
  
  app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
      error: {
        message: error.message
      }
    });
  });
  

module.exports = app;