/**
 * Finds a user with a specified activation token. 
 * Changes user account active status and removes token from record.
 * 
 * returns record modification promise
 * 
 * @param {string} [email]: user email
 * @param {string} [token]: user activation token.
 */
'use strict'

const User = require('../../db/models/user-model');

module.exports = (email, token) => {
    const changes = {
        $set: {activation_token: null, active: true}
    }
    return User.findOneAndUpdate({activation_token: token, email: email}, changes)
}