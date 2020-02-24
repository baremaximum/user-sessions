/**
 * Routes for /user/ endpoints. Defines routes and associated middleware.
 */

 const express = require('express');
 const router = express.Router();

 // Import controllers
 const register = require('../users/user-registration-controller');

 // Register new user
 router.post('/register', register )

 // Sign user in and create session in redis

 // Export for loader
 module.exports = router;