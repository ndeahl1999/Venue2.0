'use strict';

const path = require('path');

var authRouter = require("./auth");

function route(app){
    app.use('/auth', authRouter);

}

module.exports = route; 