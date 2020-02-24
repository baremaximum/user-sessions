/**
 * Define schema for users.
 */

const mongoose = require('mongoose');

//options for user schema.
const options = {
    autoIndex: true
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: { 
        type: String,
        //validate email field
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],
        required: true,
        unique: true
    }, 
    registered_on: {type: Date, default: Date.now},
    
}, options)

// Make read-only field
userSchema.pre('save', function(next) {
    if(this.isModified('registered_on')) {
        throw 'Cannot modify user registration date';
    } else {
        next();
    }
})

module.exports = userSchema;
