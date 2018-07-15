var fs = require('fs');
var express = require('express');
var bparser = require('body-parser');
var path = require('path');
var http = require('http');
var api_router = require('./app/router.api.js');

module.exports = (app) => {
  app.use(bparser.json());
  app.use(bparser.urlencoded({ extended: true}));
  app.use(express.static(path.join(__dirname, '/storage')));
  app.use('/api/v1', api_router);
  return (req,res,next) => { next() };
};