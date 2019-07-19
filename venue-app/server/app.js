'use strict';

import express from 'express';
import mongoose from 'mongoose';
mongoose.Promise = require('bluebird');
import config from './config/environment';

import http from 'http';

var app = express();
var fs = require('fs');
var morgan = require('morgan');
var MobileDetect = require('mobile-detect');
var path = require('path');


// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

// setup the logger

// include a custom field in the log to show the request source
morgan.token('isMobile', function (req, res) {
  var md = new MobileDetect(req.headers['user-agent']);
  if ( md.mobile() ) {
    return "REQUEST FROM " + md.os();
  } else {
    return "REQUEST FROM Web";
  }
});

// log the following parameters of the request isMobile/ip/time/action/parameters
app.use(morgan(':isMobile :remote-addr :date[web] :method :url :status :res[content-length]', {stream: accessLogStream}));



var server = http.createServer(app);