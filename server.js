/*main server.js*/

process.env.NODE_ENV = process.argv[2] || "development";

const express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    mongoose =  require('mongoose'),
    session = require('express-session')
    routes = require('./server/routes');

mongoose.Promise = require('bluebird');
const config = require("./server/config/environment");

const app = express();
app.use( session({
    secret            : config.secrets.session,
    resave            : false,
    saveUninitialized : true
}));
 
var fs = require("fs");

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

mongoose.connect(config.mongo.uri, {useNewUrlParser: true},   () => {
    console.log("Mongoose connected...");
});
mongoose.connection.on('error',function(err){
    console.log("Mongoose connection failed.")
});

app.use(bodyParser.json());
app.use(cors());
const server = app.listen(config.port, function(){
    console.log('Server up on port ' + config.port );
});

exports = module.exports = app; 