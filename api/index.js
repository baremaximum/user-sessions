/** 
 * Main entry point. Start the application with production variables.
 * Attaches emergency handlers. If either of these are triggered, 
 * something is wrong with the code.
 */

const errorHandler = require('./error-handler');

process.on('uncaughtException', (error)  => {
    console.log('Unhandled critical error occured: ',  error);
    errorHandler(error)
    process.exit(1); // exit application 

})

process.on('unhandledRejection', (error, promise) => {
    console.log(' Unhandled promise rejection: ', promise);
    console.log(' The error was: ', error );
    errorHandler(error)
  });

const bootstrap = require('./bootstrap');

const port = process.env.PORT || 3000;

bootstrap(process.env.DB_URL, port);
