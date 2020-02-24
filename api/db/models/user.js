/**
 * Exports user database model.
 */

const mongoose = require('mongoose');
const userSchema = require('../schemas/user');

//export the model registered from schema
module.exports = mongoose.model('user', userSchema)