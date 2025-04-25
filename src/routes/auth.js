const express = require('express');
const { signup, login } = require('../controllers/authController'); 
const { validateSignup, validateLogin } = require('../validators/authValidator'); 

const router = express.Router();

// Route for user signup
router.post('/signup', validateSignup, signup); 

// Route for user login
router.post('/login', validateLogin, login);   

module.exports = router;
