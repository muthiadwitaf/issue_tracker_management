const express = require('express');
const controller = require('../controllers/notificationsController');

const router = express.Router();

router.get('/', controller.list);
router.patch('/read-all', controller.markAllRead);
router.patch('/:id/read', controller.markRead);

module.exports = router;
