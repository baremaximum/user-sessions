/**
 * Handles requests for user registration.
 * 
 * @param {object} [req]: express request object
 * @param {object} [res]: express response object
 * @param {function} [next]: next function
 */
'use strict'
const errorHandler = require('../../error-handler');
const register = require('../../services/user/register-user');

const userRegistration = async (req, res, next) => {
    try {
        const userData = req.body;
        await register(userData);
        res.sendStatus(201);
    } catch (e){
        if(e.name === 'ValidationError'){
            res.sendStatus(400)
        } else if(e.code === 11000) {
            res.status(400).send("username and email must be unique")
        } else {
            console.log(e);
            errorHandler(e);
            res.sendStatus(500);
        }
    }
}

module.exports = userRegistration;
