/*main server.js*/

const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose =  require('mongoose');

mongoose.Promise = require('bluebird');
const config = require("./server/config/environment");

var app = express();
var fs = require("fs");

