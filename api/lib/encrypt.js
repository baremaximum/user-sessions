/**
 * Uses bcrypt library to return encrypted version of the input text.
 * 
 * @param {string} [input]: the text you want to encrypt.
 */
'use strict'

const bcrypt = require('bcryptjs');

module.exports = async input => {
    //create salt
    const salt = await bcrypt.genSalt(10);
    // use salt to hash input
    return await bcrypt.hash(input, salt);
}