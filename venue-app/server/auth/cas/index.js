const express = require('express');
var app = express();
var config = require('./../../config/environment');
var authRoute = express.Router();
var CASAutentication = require('cas-authentication');
var cas = new CASAuthentication({
    cas_url: config.auth.CAS_URL,
    
});
