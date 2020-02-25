/**
 * Handles requests to user activation endpoint.
 * 
 * @param {object} [req]: express request object
 * @param {object} [res]: express response object
 * @param {function} [next]: next function
 */
'use strict'
const errorHandler = require('../../error-handler');
const activate = require('../../services/user/activate-user-service');

module.exports = async (req, res, next) => {
    try {
        // Token is passed as a request url parameter
        const modified = await activate(req.params.email, req.params.token);

        if(!modified){
           res.sendStatus(404);
           return;
        }
        res.sendStatus(201);
    } catch (e){
        if(e === 'Invalid token'){
            // Send, but don't log user error
            res.status(400).send(e);
        } else {
            //log but don't send server error
            console.log(e);
            errorHandler(e);
            res.sendStatus(500);
        }
    }
}