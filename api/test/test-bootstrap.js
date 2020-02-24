/** 
 *   Bootstrap a testing version of the application. Exposes different port
 *   and connects to different database than production bootstrap.
 *
 *   Return an object containing database connection object, express app object,
 *   and
 *   
 */
const bootstrap = require('../bootstrap');
module.exports =  () => bootstrap(process.env.TEST_DB_URL, 3001)