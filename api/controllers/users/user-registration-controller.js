/**
 * Handles requests for user registration.
 * 
 * @param {object} [req]: express request object
 * @param {object} [res]: express response object
 * @param {function} [next]: next function
 */
'use strict'
const errorHandler = require('../../error-handler');
const register = require('../../services/user/register-user-service');

const userRegistration = async (req, res, next) => {
    try {
        const userData = req.body;
        await register(userData);
        res.sendStatus(201);
    } catch (e){
        if(e.name === 'ValidationError'){
            // Send, but don't log user error
            res.status(400).json(e);
        } else {
            //log but don't send server error
            console.log(e);
            errorHandler(e);
            res.sendStatus(500);
        }
    }
}

module.exports = userRegistration;
