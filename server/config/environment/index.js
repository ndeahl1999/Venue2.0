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
        }
    },

    cas: {
        serverURL: process.env.CAS_SERVER_URL || "http://cas-auth.rpi.edu/cas",
        version:   process.env.CAS_VERSION || "3.0"
    },

    userRoles: ['guest', 'user', 'admin']

};

module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js')
); 