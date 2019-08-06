var mongoose = require('mongoose');
mongoose.set('debug', true);
var config = require("../Utilities/config").config;

module.exports = function() {
    mongoose.Promise = global.Promise;
    var db = mongoose.connect(config.DB_URL.url, { useNewUrlParser: true });
    require('../Models/User');
    return db;
};