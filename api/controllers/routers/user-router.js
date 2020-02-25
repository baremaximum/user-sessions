/**
 * Routes for /user/ endpoints. Defines routes and associated middleware.
 */

const express = require('express');
const router = express.Router();

// Import controllers
const register = require('../users/user-registration-controller');
const activate = require('../users/user-activation-controller');

// Register new user
router.post('/register', register );

// Activate user
router.put('/activate/:email/:token', activate);

// Sign user in and create session in redis

// Export for loader
module.exports = router;