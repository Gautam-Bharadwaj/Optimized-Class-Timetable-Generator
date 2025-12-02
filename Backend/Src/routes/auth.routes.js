const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authApiKey = require('../middleware/authApiKey');

// Apply API Key check
router.use(authApiKey);

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
