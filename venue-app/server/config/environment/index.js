'use strict';

var path = require('path');
var _ = require("lodash");


var all = {
    env : process.env.NODE_ENV,

    root: path.normalize(__dirname + "/../.."),

    port: process.env.PORT || 8080,

    ip: process.env.IP || '0.0.0.0',

    secrets: {
        session: process.env.VENUE_SECRET || 'venue-secret'
    },

    mongo: {
        options: {
          db: {
            safe: true
          }
        },
        uri :'mongodb://127.0.0.1/venue'
    },

    cas: {
        serverURL: process.env.CAS_SERVER_URL,
        version:   process.env.CAS_VERSION
    }

};

module.exports = all; 