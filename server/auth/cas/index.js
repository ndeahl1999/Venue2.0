const express = require('express');
var app = express();
var config = require('./../../config/environment');
var authRoute = express.Router();
var CASAutentication = require('cas-authentication');
var cas = new CASAuthentication({
    cas_url: config.cas.server_URL,
    cas_version = config.cas.version    
});
