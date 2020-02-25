/**
 * Return a URL for user account activation. URL uses input token and email
 * as parameters.
 * 
 * Will get host url from docker environment, and append parameters to that url.
 * 
 * @param {string} [token]: Activation token
 * 
 * @param {string} [email]: User's email
 */

 const host = process.env.HOST_URL;
 
 module.exports = (email, token) => {
     return `${host}/${email}/${token}`
 }