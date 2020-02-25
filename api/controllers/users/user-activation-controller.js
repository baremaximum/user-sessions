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

        // If there is no matching user, send 404.
        if(!modified){
           res.sendStatus(404);
           return;
        }

        res.sendStatus(201);
    } catch (e){
        //log but don't send server error
        console.log(e);
        errorHandler(e);
        res.sendStatus(500);
    }
}