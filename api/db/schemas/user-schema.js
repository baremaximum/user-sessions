/**
 * Define schema for users.
 */

const mongoose = require('mongoose');
const validation = require('mongoose-beautiful-unique-validation');

//options for user schema.
const options = {
    autoIndex: true
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: `The username ({VALUE}) is already in use`
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
        unique: `The email address ({VALUE}) is already in use`
    }, 
    registered_on: {type: Date, default: Date.now},
    
    activated: {
        type: Boolean,
        default: false
    }
    
}, options)

// Make read-only field
userSchema.pre('save', function(next) {
    if(this.isModified('registered_on')) {
        throw 'Cannot modify user registration date';
    } else {
        next();
    }
})

// Register plugin for validation messages. Replace default message.
userSchema.plugin(validation, {
    defaultMessage: "This custom message will be used as the default"
});

module.exports = userSchema;
