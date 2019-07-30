'use strict';

var path = require('path');


var all = {
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
        }
    },

    cas: {
        serverURL: process.env.CAS_SERVER_URL,
        version:   process.env.CAS_VERSION
    }

};

module.exports = all; 