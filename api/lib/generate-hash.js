/**
 * Generates a random 20 byte hash and returns it as a hex string
 */
'use strict'
const crypto = require('crypto');

module.exports = () => {
    // must specify hex encoding, otherwise gibberish since utf-8 doesn't have requisite values
    return crypto.randomBytes(20).toString('hex');
}