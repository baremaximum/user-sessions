/**
 * Registers new user with provided information.
 * 
 * @param {UserObject} [userData]: Object containing user data to be saved.
 */
const User = require('../../db/models/user-model');

const registerUser = async userData => {
    const user = new User(userData);
    return await user.save();
}

module.exports = registerUser
