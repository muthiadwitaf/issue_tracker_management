const express = require('express');
const controller = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/login', controller.login);
router.get('/me', auth, controller.me);

module.exports = router;
