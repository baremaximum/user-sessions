/**
 * Registers new user with provided information. Generate user activation
 * token, and save it to user record upon creation.
 * 
 * @param {UserObject} [userData]: Object containing user data to be saved.
 */
'use strict';

const User = require('../../db/models/user-model');
const genHash = require('../../lib/generate-hash');
const encrypt = require('../../lib/encrypt');

const registerUser = async userData => {
    let user = new User(userData);

    //create account activation token
    user.activation_token = genHash();

    //encrypt password
    user.password = await encrypt(userData.password);

    //save new user
    return user.save();
}

module.exports = registerUser
