/**
 *  Return a mongoose connection promise that connects to a database
 *  at a given uri using a set of specified. 
 *
 *   @param {string} [uri]: Mongodb url.
 */
'use strict';

const mongoose = require('mongoose');
const secrets = require('docker-secret');

const password = secrets.getSecret('db_password')

module.exports = uri => {
    var options = {
        useNewUrlParser: true,
        autoIndex: false,
        useUnifiedTopology: true,
        poolSize: 10,
        bufferMaxEntries: 0,
        user:  process.env.DB_USERNAME,
        pass: password
      };
      return mongoose.connect(uri, options);
}