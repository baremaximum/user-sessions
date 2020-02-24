/** 
 *   Initializes an http server application that connects to a database
 *   at the specified URI, and listens for connections on a specified port.
 *
 *   Returns an obect that contains the database connection object,
 *   the express application object, and the http server object.
 *
 *    Return value exists solely for testing purposes.
 *
 *   @param {string} [uri]: Database uri.
 *
 *   @param {number} [port]: Port the server will listen on.
 *
 */
'use strict';

const errorHandler = require('./error-handler');
const CONNECTION = require('./db/db-connection');
const express = require('express');
const app = express();
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

module.exports = async (uri, port) => {
    let CONN;
    // Connect to database on startup. Catch and log connection errors.
    try {
        CONN = await CONNECTION(uri);

         // Catch and log errors that occur within the connection observable
        mongoose.connection.on('error', err => {
            errorHandler(err);
        })

        // Notification upon successful connection
        mongoose.connection.on('connected', () => {
            console.log(`Application successfuly connected to database at ${uri}`)
        })
        
        //loaders
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
         

        //set trust proxy to true since this app is only accessed through docker network
        app.enable('trust proxy');

        //bootstrap all routes form /routes directory
        const userRoutes = require('./controllers/routers/user-router');
        app.use('/users', userRoutes);
        
       

        app.set('port', port);
        const server = http.createServer(app);
    
        // Listen on the specified port and log a notification.
        server.listen(port, () => console.log(`API listening on port:${port}`));
    
        return {CONN, app, server };
    } catch (e) {
        console.log(e)
        errorHandler(e);
        return;
    }
}