/**
 * Registers new user with provided information. Generate user activation
 * token, and save it to user record upon creation.
 * 
 * @param {UserObject} [userData]: Object containing user data to be saved.
 */
const User = require('../../db/models/user-model');
const genHash = require('../../lib/generate-hash');
const bcrypt = require('bcryptjs');

const registerUser = async userData => {
    let user = new User(userData);

    //create account activation token
    const hash = genHash();
    user.activation_token = hash;

    //encrypt password
    const encrypted = userData.password
    return await user.save();
}

module.exports = registerUser
